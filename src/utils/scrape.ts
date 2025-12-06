import { parseHTML } from "linkedom";
import { GameDefinition, ScrapedResult } from "../types";

function clean(t: string | null | undefined): string | null {
  if (!t) return null;
  return t.replace(/\s+/g, " ").trim();
}

function findMoney(text: string | null): string | null {
  if (!text) return null;
  const m = text.match(/\$\s*\d[\d,\.]*/);
  return m ? m[0] : null;
}

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

  const card = document.querySelector(".c-draw-card");
  if (!card) return false;

  // ----------------------------------
  // DATE
  // ----------------------------------
  const rawDate =
    card.querySelector(".c-draw-card__draw-date")?.textContent ?? "";

  const match = rawDate.match(/([A-Za-z]{3,}\s+\d{1,2},\s*\d{4})/);
  if (!match) return false;

  const drawDate = new Date(match[1]);
  const draw_date = drawDate.toISOString().split("T")[0];

  // ----------------------------------
  // NUMBERS
  // ----------------------------------
  const balls = [...card.querySelectorAll(".c-ball")].map((el) =>
    Number(el.textContent.trim())
  );

  const numbers = balls.slice(0, game.mainNumbers);
  const extra_number = game.hasExtraBall
    ? balls[game.mainNumbers] ?? null
    : null;

  // ===================================================================
  // UNIVERSAL PRIZE LOGIC (pega Top prize / Jackpot / Next top prize)
  // ===================================================================
  let est_jackpot: string | null = null;
  let next_est_jackpot: string | null = null;
  let cash_value: string | null = null;
  let next_cash_value: string | null = null;

  // ------------------------
  // 1. TOP PRIZE / JACKPOT (Atual)
  // ------------------------
  const prizeLabel = clean(
    card.querySelector(".c-draw-card__metric-label")?.textContent
  );
  const prizeValue = clean(
    card.querySelector(".c-draw-card__prize-value")?.textContent
  );

  if (prizeLabel && prizeValue) {
    const prizeLower = prizeLabel.toLowerCase();

    if (prizeLower.includes("top prize")) {
      est_jackpot = prizeValue;
      next_est_jackpot = prizeValue; // regra confirmada
    }

    if (prizeLower.includes("jackpot")) {
      est_jackpot = prizeValue;
      next_est_jackpot = prizeValue;
    }
  }

  // -----------------------------
  // 2. PROXIMO PRÊMIO (lado direito)
  // -----------------------------
  const infoBoxes = [...document.querySelectorAll(".c-state-short-info__box")];

  for (const box of infoBoxes) {
    const title = clean(
      box.querySelector(".c-state-short-info__title")?.textContent
    );
    const value = clean(
      box.querySelector(".c-state-short-info__subtitle")?.textContent
    );
    if (!title || !value) continue;

    const ttl = title.toLowerCase();

    // Next top prize
    if (ttl.includes("next top prize")) {
      const m = findMoney(value);
      if (m) next_est_jackpot = m;
    }

    // Next jackpot
    if (ttl.includes("next") && ttl.includes("jackpot")) {
      const m = findMoney(value);
      if (m) next_est_jackpot = m;
    }

    // Cash Value Atual
    if (ttl.includes("cash value")) {
      const m = findMoney(value);
      if (m) cash_value = m;
    }

    // Next Cash Value
    if (ttl.includes("cash value") && ttl.includes("next")) {
      const m = findMoney(value);
      if (m) next_cash_value = m;
    }
  }

  const result: ScrapedResult = {
    game_id: game.game_id,
    draw_date,
    numbers,
    extra_number,
    est_jackpot,
    cash_value,
    next_est_jackpot,
    next_cash_value,
  };

  return result;
}
