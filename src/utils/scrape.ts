// src/utils/scrape.ts
import { parseHTML } from "linkedom";
import { GameDefinition, ScrapedResult } from "../types";

function clean(t: string | null | undefined): string | null {
  if (!t) return null;
  return t.replace(/\s+/g, " ").trim();
}

export async function scrapeGame(
  game: GameDefinition
): Promise<ScrapedResult | false> {
  console.log(`🔍 Scraping: ${game.displayName}`);

  // ------------------------------------------------
  // FETCH
  // ------------------------------------------------
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
  if (!card) {
    console.error("❌ Nenhum .c-draw-card encontrado");
    return false;
  }

  // ------------------------------------------------
  // DATE
  // ------------------------------------------------
  const rawDate =
    card.querySelector(".c-draw-card__draw-date")?.textContent ?? "";
  const match = rawDate.match(/([A-Za-z]{3,}\s+\d{1,2},\s*\d{4})/);

  if (!match) {
    console.error("⚠ Data inválida");
    return false;
  }

  const drawDate = new Date(match[1]);
  const draw_date = drawDate.toISOString().split("T")[0];

  // ------------------------------------------------
  // NUMBERS
  // ------------------------------------------------
  const balls = [...card.querySelectorAll(".c-ball")].map((el) =>
    Number(el.textContent.trim())
  );

  const numbers = balls.slice(0, game.mainNumbers);
  const extra_number = game.hasExtraBall
    ? balls[game.mainNumbers] ?? null
    : null;

  // ------------------------------------------------
  // JACKPOT (ATUAL)
  // ------------------------------------------------
  const est_jackpot =
    clean(card.querySelector(".c-draw-card__prize-value")?.textContent) || null;

  // ------------------------------------------------
  // NEXT JACKPOT (CORREÇÃO AQUI!)
  //
  // Precisamos localizar o bloco onde:
  //    .c-state-short-info__title includes "Next"
  //    AND includes "jackpot"
  //
  // ------------------------------------------------
  let next_est_jackpot: string | null = null;
  let next_cash_value: string | null = null;

  const boxes = [...document.querySelectorAll(".c-state-short-info__box")];

  for (const box of boxes) {
    const title = clean(
      box.querySelector(".c-state-short-info__title")?.textContent
    );
    const subtitle = clean(
      box.querySelector(".c-state-short-info__subtitle")?.textContent
    );

    if (!title || !subtitle) continue;

    const titleLower = title.toLowerCase();

    // -------------------------------
    // NEXT EST. JACKPOT – PEGAR APENAS VALORES $
    // -------------------------------
    if (
      titleLower.includes("next") &&
      (titleLower.includes("jackpot") || titleLower.includes("est. jackpot"))
    ) {
      const jackpotMatch = subtitle.match(/\$\s*\d[\d,\.]*/);
      if (jackpotMatch) {
        next_est_jackpot = jackpotMatch[0];
      }
    }

    // -------------------------------
    // NEXT CASH VALUE
    // -------------------------------
    if (titleLower.includes("cash value")) {
      const cashMatch = subtitle.match(/\$\s*\d[\d,\.]*/);
      if (cashMatch) {
        next_cash_value = cashMatch[0];
      }
    }
  }

  const result: ScrapedResult = {
    game_id: game.game_id,
    draw_date,
    numbers,
    extra_number,
    est_jackpot,
    cash_value: null,
    next_est_jackpot,
    next_cash_value,
  };

  return result;
}
