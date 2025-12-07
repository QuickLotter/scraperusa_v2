import { parseHTML } from "linkedom";
import { GameDefinition, ScrapedResult } from "../types";

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

  // --------------------------------------------------
  // DATE
  // --------------------------------------------------
  const rawDate =
    card.querySelector(".c-draw-card__draw-date")?.textContent ?? "";

  const match = rawDate.match(/([A-Za-z]{3,}\s+\d{1,2},\s*\d{4})/);
  if (!match) return false;

  const drawDate = new Date(match[1]);
  const draw_date = drawDate.toISOString().split("T")[0];

  // --------------------------------------------------
  // NUMBERS
  // --------------------------------------------------
  const balls = [...card.querySelectorAll(".c-ball")].map((el) =>
    Number(el.textContent.trim())
  );

  const numbers = balls.slice(0, game.mainNumbers);
  const extra_number = game.hasExtraBall
    ? balls[game.mainNumbers] ?? null
    : null;

  // ===================================================================
  // JACKPOT UNIVERSAL: atual e próximo
  // ===================================================================
  let est_jackpot: string | null = null;
  let next_est_jackpot: string | null = null;
  let cash_value: string | null = null;
  let next_cash_value: string | null = null;

  // -------------------------------
  // PRIZE LABEL & VALUE (Atual)
  // -------------------------------
  const prizeLabel = clean(
    card.querySelector(".c-draw-card__metric-label")?.textContent
  );
  const prizeValue = clean(
    card.querySelector(".c-draw-card__prize-value")?.textContent
  );

  if (prizeLabel && prizeValue) {
    const lower = prizeLabel.toLowerCase();

    if (lower.includes("top prize") || lower.includes("jackpot")) {
      est_jackpot = prizeValue;
      next_est_jackpot = prizeValue; // regra confirmada
    }
  }

  // ===========================================================
  // INFO BOXES (Next jackpot / Next cash value / Cash value)
  // ===========================================================
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

    // --------------------------
    // NEXT JACKPOT (pode conter cash value junto)
    // --------------------------
    if (
      ttl.includes("next") &&
      (ttl.includes("jackpot") ||
        ttl.includes("est. jackpot") ||
        ttl.includes("top prize"))
    ) {
      const moneyList = findMoneyAll(subtitle);

      if (moneyList.length >= 1) {
        next_est_jackpot = moneyList[0]; // jackpot correto
      }

      if (moneyList.length >= 2) {
        next_cash_value = moneyList[1]; // cash value embutido
      }

      continue;
    }

    // --------------------------
    // CASH VALUE ATUAL
    // --------------------------
    if (ttl.includes("cash value") && !ttl.includes("next")) {
      cash_value = findMoney(subtitle);
      continue;
    }

    // --------------------------
    // NEXT CASH VALUE (se vier separado)
    // --------------------------
    if (ttl.includes("cash value") && ttl.includes("next")) {
      next_cash_value = findMoney(subtitle);
      continue;
    }
  }

  // RESULTADO FINAL
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
