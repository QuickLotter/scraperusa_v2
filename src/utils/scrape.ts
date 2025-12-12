// src/utils/scrape.ts
import { parseHTML } from "linkedom";
import { GameDefinition, ScrapedResult } from "../types";

// ===========================================================
// HELPERS
// ===========================================================

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

// ===========================================================
// MAIN SCRAPER
// ===========================================================

export async function scrapeGame(
  game: GameDefinition
): Promise<ScrapedResult | false> {
  console.log(`🔍 Scraping: ${game.displayName}`);

  // ---------------- HTTP REQUEST ----------------
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

  // ===========================================================
  // CARD PRINCIPAL
  // ===========================================================
  const card = document.querySelector(".c-draw-card");
  if (!card) {
    console.log("⚠️ Nenhum .c-draw-card encontrado");
    return false;
  }

  // ===========================================================
  // DATA
  // ===========================================================
  const rawDate =
    card.querySelector(".c-draw-card__draw-date")?.textContent ?? "";

  const match = rawDate.match(/([A-Za-z]{3,}\s+\d{1,2},\s*\d{4})/);
  if (!match) return false;

  const drawDate = new Date(match[1]);
  const draw_date = drawDate.toISOString().split("T")[0];

  // ===========================================================
  // NÚMEROS
  // ===========================================================
  const balls = [...card.querySelectorAll(".c-ball")].map((el) =>
    Number(el.textContent.trim())
  );

  const numbers = balls.slice(0, game.mainNumbers);
  const extra_number = game.hasExtraBall
    ? balls[game.mainNumbers] ?? null
    : null;

  // ===========================================================
  // JACKPOT
  // ===========================================================
  let est_jackpot: string | null = null;
  let next_est_jackpot: string | null = null;
  let cash_value: string | null = null;

  const prizeLabel = clean(
    card.querySelector(".c-draw-card__metric-label")?.textContent
  );
  const prizeValue = clean(
    card.querySelector(".c-draw-card__prize-value")?.textContent
  );

  const isTopPrize = prizeLabel?.toLowerCase().includes("top prize") ?? false;

  const looksFixedJackpot =
    prizeValue &&
    !prizeValue.toLowerCase().includes("million") &&
    !prizeValue.toLowerCase().includes("billion");

  // ===========================================================
  // 🎯 REGRAS AUTOMÁTICAS PARA DEFINIR JACKPOT FIXO
  // ===========================================================
  // Exemplos:
  // "$500", "$5,000", "$18,923", "$50,000"
  //
  // ✔ Jogos Pick / Numbers / Win4 / Cash5 / Fantasy5 (alguns estados)
  // ✔ Jackpot que NÃO aparece em caixa "Next Jackpot"
  // ✔ Top prize nunca tem next jackpot
  // ===========================================================

  const boxes = [...document.querySelectorAll(".c-state-short-info__box")];

  const hasNextJackpotBox = boxes.some((box) => {
    const t = clean(
      box.querySelector(".c-state-short-info__title")?.textContent
    )?.toLowerCase();
    return t?.includes("next") && t.includes("jackpot");
  });

  const isFixed = isTopPrize || looksFixedJackpot || !hasNextJackpotBox; // sem next jackpot → jackpot fixo

  if (isFixed) {
    est_jackpot = prizeValue;
    next_est_jackpot = null;
    cash_value = null;
  } else {
    // ===========================================================
    // 🎯 JOGOS PROGRESSIVOS (Mega, Powerball, Lotto, etc.)
    // ===========================================================

    est_jackpot = prizeValue;

    // ---------- CASH VALUE ----------
    const cashNode = document.querySelector(
      ".c-state-short-info__subtitle--sub"
    );
    if (cashNode) {
      const txt = clean(cashNode.textContent);
      if (txt?.toLowerCase().includes("cash value")) {
        cash_value = findMoney(txt);
      }
    }

    // ---------- NEXT JACKPOT ----------
    for (const box of boxes) {
      const title = clean(
        box.querySelector(".c-state-short-info__title")?.textContent
      )?.toLowerCase();
      const subtitle = clean(
        box.querySelector(".c-state-short-info__subtitle")?.textContent
      );

      if (!title || !subtitle) continue;

      if (
        title.includes("next") &&
        (title.includes("jackpot") ||
          title.includes("top prize") ||
          title.includes("est. jackpot"))
      ) {
        next_est_jackpot = findMoney(subtitle);
      }
    }
  }

  // ===========================================================
  // REGRAS ESPECIAIS — CASH4LIFE / LUCKY FOR LIFE
  // ===========================================================
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
    cash_value = null;
  }

  // ===========================================================
  // FINAL
  // ===========================================================
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
