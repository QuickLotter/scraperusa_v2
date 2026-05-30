import axios from "axios";
import { supabase } from "../supabase/supabaseClient";
import { DateTime } from "luxon";

const NY_OPEN_DATA_URL =
  "https://data.ny.gov/resource/7sqk-ycpk.json";

const POLL_INTERVAL_MS = 3 * 60 * 1000; // 3 minutos
const FETCH_LIMIT = 20; // últimos 20 sorteios por poll (cobre ~80 min)

interface NYOpenDataRow {
  draw_date: string;
  draw_nbr: string;
  winning_numbers: string;
  bonus?: string;
  multiplier?: string;
}

interface QuickDrawResult {
  game_id: string;
  draw_date: string;
  draw_number: number;
  draw_time: string | null;
  numbers: number[];
  extra_number: number | null;
  multiplier: string | null;
}

function parseRow(row: NYOpenDataRow): QuickDrawResult | null {
  try {
    const drawDateRaw = row.draw_date ?? "";
    const drawDate = drawDateRaw.slice(0, 10); // "2026-05-30"
    const drawTime = drawDateRaw.length > 10
      ? drawDateRaw.slice(11, 19)
      : null;

    const drawNumber = parseInt(row.draw_nbr ?? "0", 10);
    if (!drawNumber) return null;

    const numbers = (row.winning_numbers ?? "")
      .split(" ")
      .map((n) => parseInt(n, 10))
      .filter((n) => !isNaN(n));

    if (numbers.length !== 20) return null;

    const extraNumber = row.bonus ? parseInt(row.bonus, 10) : null;
    const multiplier = row.multiplier ?? null;

    return {
      game_id: "quickdraw_ny",
      draw_date: drawDate,
      draw_number: drawNumber,
      draw_time: drawTime,
      numbers,
      extra_number: extraNumber,
      multiplier,
    };
  } catch {
    return null;
  }
}

async function fetchLatestDraws(): Promise<QuickDrawResult[]> {
  const response = await axios.get<NYOpenDataRow[]>(NY_OPEN_DATA_URL, {
    params: {
      $limit: FETCH_LIMIT,
      $order: "draw_date DESC",
    },
    timeout: 15000,
  });

  const results: QuickDrawResult[] = [];
  for (const row of response.data) {
    const parsed = parseRow(row);
    if (parsed) results.push(parsed);
  }

  return results;
}

async function saveDraws(draws: QuickDrawResult[]): Promise<number> {
  if (!draws.length) return 0;

  const { error } = await supabase
    .from("results_ny")
    .upsert(draws, {
      onConflict: "game_id,draw_date,draw_number",
      ignoreDuplicates: true,
    });

  if (error) {
    console.error("❌ Erro ao salvar Quick Draw:", error.message);
    return 0;
  }

  return draws.length;
}

async function poll(): Promise<void> {
  const nowET = DateTime.now().setZone("America/New_York");

  // Quick Draw fecha das 3:30am às 4:00am ET
  const hour = nowET.hour;
  const minute = nowET.minute;
  if (hour === 3 && minute >= 30) {
    console.log("⏸️  Quick Draw fechado (3:30-4:00 AM ET) — aguardando...");
    return;
  }

  console.log(`\n🎱 Quick Draw poll — ${nowET.toFormat("HH:mm:ss")} ET`);

  try {
    const draws = await fetchLatestDraws();
    console.log(`  📥 ${draws.length} sorteios recebidos da API`);

    const saved = await saveDraws(draws);
    console.log(`  💾 ${saved} sorteios processados`);

    if (draws.length > 0) {
      const latest = draws[0];
      console.log(
        `  🔢 Último draw: #${latest.draw_number} — ${latest.numbers.join(", ")}` +
        (latest.extra_number ? ` | Bonus: ${latest.extra_number}` : "") +
        (latest.multiplier ? ` | Money Dots: ${latest.multiplier}` : "")
      );
    }
  } catch (err: any) {
    console.error(`  ❌ Erro no poll: ${err.message}`);
  }
}

export async function startQuickDrawWatcher(): Promise<void> {
  console.log("🚀 Quick Draw Watcher iniciado");
  console.log(`⏱️  Polling a cada ${POLL_INTERVAL_MS / 1000}s`);

  // Poll imediato ao iniciar
  await poll();

  // Loop contínuo
  setInterval(async () => {
    await poll();
  }, POLL_INTERVAL_MS);
}
