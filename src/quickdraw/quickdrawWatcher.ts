import axios from "axios";
import { supabase } from "../supabase/supabaseClient";
import { DateTime } from "luxon";

// ─── Endpoints oficiais do NY Lottery ───────────────────────────────────────
// Endpoint 1: tempo real, todos os jogos, últimos ~8 sorteios por jogo
const ALL_DRAWS_URL = "https://nylottery.ny.gov/nyl-api/games/all/draws";

// Endpoint 2: histórico paginado, apenas Quick Draw, 25 por página
const HISTORY_URL =
  "https://nylottery.ny.gov/drupal-api/api/v2/winning_numbers?format=json&nid=400&sort_by=draw_number&page=";

const POLL_INTERVAL_MS = 60 * 1000; // 1 minuto (sorteio a cada 4 min)

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36",
  Accept: "application/json, text/plain, */*",
  Referer: "https://nylottery.ny.gov/all-winning-numbers?nid=400",
};

interface QuickDrawResult {
  game_id: "quickdraw_ny";
  draw_date: string;
  draw_number: number;
  draw_time: string | null;
  numbers: number[];
  extra_number: number | null;
  multiplier: string | null;
  est_jackpot: string | null;
}

// ─── Parse do endpoint /nyl-api/games/all/draws ─────────────────────────────
function parseAllDrawsResponse(data: any): QuickDrawResult[] {
  const results: QuickDrawResult[] = [];
  const qd = data?.data?.quickdraw;
  if (!qd?.draws) return results;

  for (const draw of qd.draws) {
    if (!draw.results || draw.status !== 22) continue; // status 22 = resultado publicado

    const drawNumber = draw.drawNumber;
    const resultDate = new Date(draw.resultDate);
    const drawDate = DateTime.fromJSDate(resultDate)
      .setZone("America/New_York")
      .toFormat("yyyy-MM-dd");
    const drawTime = DateTime.fromJSDate(resultDate)
      .setZone("America/New_York")
      .toFormat("HH:mm:ss");

    const primary = draw.results[0]?.primary ?? [];
    const numbers = primary.map((n: string) => parseInt(n, 10));
    if (numbers.length !== 20) continue;

    const multiplier = draw.results[0]?.multiplier
      ? String(draw.results[0].multiplier)
      : null;

    results.push({
      game_id: "quickdraw_ny",
      draw_date: drawDate,
      draw_number: drawNumber,
      draw_time: drawTime,
      numbers,
      extra_number: null,
      multiplier,
      est_jackpot: null,
    });
  }

  return results;
}

// ─── Parse do endpoint /drupal-api (histórico paginado) ──────────────────────
function parseHistoryRow(row: any): QuickDrawResult | null {
  try {
    const drawDate = row.date; // "2026-05-30"
    const drawTime = row.draw_time; // "08:56:00"
    const drawNumber = parseInt(row.draw_number, 10);
    const numbers = (row.winning_numbers ?? []).map((n: string) =>
      parseInt(n, 10)
    );
    if (numbers.length !== 20 || !drawNumber) return null;

    const multiplier = row.multiplier && row.multiplier !== "00"
      ? row.multiplier
      : null;

    return {
      game_id: "quickdraw_ny",
      draw_date: drawDate,
      draw_number: drawNumber,
      draw_time: drawTime,
      numbers,
      extra_number: null,
      multiplier,
      est_jackpot: row.jackpot ? String(row.jackpot) : null,
    };
  } catch {
    return null;
  }
}

// ─── Salvar no Supabase ───────────────────────────────────────────────────────
async function saveDraws(draws: QuickDrawResult[]): Promise<number> {
  if (!draws.length) return 0;

  const { error } = await supabase.from("results_ny").upsert(draws, {
    onConflict: "game_id,draw_date,draw_number",
    ignoreDuplicates: true,
  });

  if (error) {
    console.error("❌ Erro ao salvar:", error.message);
    return 0;
  }
  return draws.length;
}

// ─── Poll em tempo real ──────────────────────────────────────────────────────
async function pollRealtime(): Promise<void> {
  const nowET = DateTime.now().setZone("America/New_York");
  const h = nowET.hour;
  const m = nowET.minute;

  // Quick Draw fecha 3:30–4:00 AM ET
  if (h === 3 && m >= 30) {
    console.log("⏸️  Quick Draw fechado (3:30-4:00 AM ET)");
    return;
  }

  try {
    const { data } = await axios.get(ALL_DRAWS_URL, {
      headers: HEADERS,
      timeout: 10000,
    });

    const draws = parseAllDrawsResponse(data);
    if (!draws.length) {
      console.log("  ⚠️  Nenhum resultado novo no endpoint realtime");
      return;
    }

    const saved = await saveDraws(draws);
    const latest = draws[0];
    console.log(
      `  🎱 Draw #${latest.draw_number} @ ${latest.draw_time} ET | ` +
        `[${latest.numbers.slice(0, 5).join(",")}...] x${latest.multiplier} | ` +
        `${saved} salvos`
    );
  } catch (err: any) {
    console.error(`  ❌ Erro realtime: ${err.message}`);
  }
}

// ─── Importar histórico paginado ─────────────────────────────────────────────
export async function importHistory(pages = 120): Promise<void> {
  console.log(`📚 Importando histórico Quick Draw (${pages} páginas × 25)...`);
  let total = 0;

  for (let page = 0; page < pages; page++) {
    try {
      const url = `${HISTORY_URL}${page}`;
      const { data } = await axios.get(url, { headers: HEADERS, timeout: 15000 });
      const rows: any[] = data?.rows ?? [];
      if (!rows.length) {
        console.log(`  Página ${page}: sem dados — parando`);
        break;
      }

      const draws = rows.map(parseHistoryRow).filter(Boolean) as QuickDrawResult[];
      const saved = await saveDraws(draws);
      total += saved;

      console.log(
        `  Página ${page}: ${draws.length} sorteios, ${saved} novos (total: ${total})`
      );

      // Rate limit gentil
      await new Promise((r) => setTimeout(r, 300));
    } catch (err: any) {
      console.error(`  ❌ Página ${page} erro: ${err.message}`);
    }
  }

  console.log(`✅ Histórico importado: ${total} sorteios`);
}

// ─── Watcher principal ────────────────────────────────────────────────────────
export async function startQuickDrawWatcher(): Promise<void> {
  console.log("🚀 Quick Draw Watcher iniciado");
  console.log(`   Realtime: ${ALL_DRAWS_URL}`);
  console.log(`   Histórico: ${HISTORY_URL}0`);
  console.log(`   Poll: a cada ${POLL_INTERVAL_MS / 1000}s\n`);

  // Poll imediato
  await pollRealtime();

  // Loop contínuo
  setInterval(async () => {
    const nowET = DateTime.now().setZone("America/New_York");
    process.stdout.write(`[${nowET.toFormat("HH:mm:ss")} ET] `);
    await pollRealtime();
  }, POLL_INTERVAL_MS);
}
