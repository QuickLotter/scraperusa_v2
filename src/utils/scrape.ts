// src/utils/scrape.ts
import { parseHTML } from "linkedom";
import { GameDefinition, ScrapedResult } from "../types";

// ================ HELPERS =====================================

function clean(t: string | null | undefined): string | null {
  if (!t) return null;
  return t.replace(/\s+/g, " ").trim();
}

function findMoneyAll(text: string | null): string[] {
  if (!text) return [];
  return text.match(/\$\s*\d[\d,\.]*\s*(Million|Billion|Thousand)?/gi) || [];
}

function findMoney(text: string | null): string | null {
  const list = findMoneyAll(text);
  return list.length > 0 ? list[0] : null;
}

// ================ MAIN SCRAPER =====================================

export async function scrapeGame(
  game: GameDefinition
): Promise<ScrapedResult | false> {
  console.log(`🔍 Scraping: ${game.displayName}`);

  let resp: Response;
  try {
    resp = await fetch(game.url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
      },
    });
  } catch {
    console.error(`❌ Erro ao acessar ${game.url}`);
    return false;
  }

  const html = await resp.text();
  const { document } = parseHTML(html);

  // =================== CARD PRINCIPAL ================================
  const card = document.querySelector(".c-draw-card");
  if (!card) {
    console.log("⚠️ Nenhum card .c-draw-card encontrado");
    return false;
  }

  // =================== DATA DO SORTEIO ================================
  const rawDate =
    card.querySelector(".c-draw-card__draw-date")?.textContent ?? "";

  const match = rawDate.match(/([A-Za-z]{3,}\s+\d{1,2},\s*\d{4})/);
  if (!match) return false;

  const drawDate = new Date(match[1]);
  const draw_date = drawDate.toISOString().split("T")[0];

  // =================== NÚMEROS ================================
  const balls = [...card.querySelectorAll(".c-ball")].map((el) =>
    Number(el.textContent.trim())
  );

  const numbers = balls.slice(0, game.mainNumbers);
  const extra_number = game.hasExtraBall
    ? balls[game.mainNumbers] ?? null
    : null;

  // ================= JACKPOTS ================================
  let est_jackpot: string | null = null;
  let next_est_jackpot: string | null = null;
  let cash_value: string | null = null;

  // Jackpot atual no topo do card
  const prizeLabel = clean(
    card.querySelector(".c-draw-card__metric-label")?.textContent
  );
  const prizeValue = clean(
    card.querySelector(".c-draw-card__prize-value")?.textContent
  );

  if (prizeLabel && prizeValue) {
    const lower = prizeLabel.toLowerCase();
    if (lower.includes("jackpot") || lower.includes("top prize")) {
      est_jackpot = prizeValue;
      next_est_jackpot = prizeValue; // fallback
    }
  }

  // ================= CASH VALUE — CORREÇÃO DO SELETOR ====================
  const cashSub = document.querySelector(".c-state-short-info__subtitle--sub");

  if (cashSub) {
    const txt = clean(cashSub.textContent);
    if (txt?.toLowerCase().includes("cash value")) {
      const money = findMoney(txt);
      if (money) cash_value = money;
    }
  }

  // ================= INFO BOXES ====================
  const boxes = [...document.querySelectorAll(".c-state-short-info__box")];

  for (const box of boxes) {
    const title = clean(
      box.querySelector(".c-state-short-info__title")?.textContent
    );
    const subtitle = clean(
      box.querySelector(".c-state-short-info__subtitle")?.textContent
    );

    if (!title || !subtitle) continue;

    const ttl = title.toLowerCase();

    // ▸ Próximo Jackpot
    if (
      ttl.includes("next") &&
      (ttl.includes("jackpot") ||
        ttl.includes("top prize") ||
        ttl.includes("est. jackpot"))
    ) {
      const money = findMoney(subtitle);
      if (money) next_est_jackpot = money;
      continue;
    }

    // (SE aparecer um "Next Cash Value" separado)
    if (ttl.includes("cash value") && ttl.includes("next")) {
      const money = findMoney(subtitle);
      if (money) cash_value = money;
      continue;
    }
  }

  // ==========================================================
  // REGRAS ESPECIAIS PARA CASH4LIFE / LUCKY FOR LIFE
  // ==========================================================
  if (
    [
      "cash4life_ny",
      "cash4life_fl",
      "luckyforlife_oh",
      "luckyforlife_id",
    ].includes(game.game_id)
  ) {
    est_jackpot = "$1,000 Per day for life";
    next_est_jackpot = "$1,000";
    cash_value = null; // esses jogos não têm cash value
  }

  // ================= RESULTADO FINAL ==========================
  return {
    game_id: game.game_id,
    draw_date,
    numbers,
    extra_number,
    est_jackpot,
    cash_value,
    next_est_jackpot,
  };
}
