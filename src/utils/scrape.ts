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

function parseDateToISO(raw: string): string | null {
  const cleaned = clean(raw) || "";
  const match = cleaned.match(/([A-Za-z]{3,9},?\s+[A-Za-z]{3,9}\s+\d{1,2},\s*\d{4}|[A-Za-z]{3,9}\s+\d{1,2},\s*\d{4})/);

  if (!match) return null;

  const parsed = new Date(match[1].replace(/^([A-Za-z]{3,9}),\s*/, "$1, "));
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toISOString().split("T")[0];
}

function extractMainAndExtraFromRow(
  row: Element,
  mainNumbersCount: number
): { numbers: number[]; extra_number: number | null } {
  const numbers: number[] = [];

  // Somente bolas principais: li.c-ball que são filhos diretos da lista principal
  const mainBallNodes = row.querySelectorAll(
    ".c-draw-card__result .c-result.c-draw-card__ball-list > li.c-ball"
  );

  for (const el of mainBallNodes) {
    const txt = clean(el.textContent);
    const n = Number(txt);
    if (!Number.isNaN(n)) numbers.push(n);
  }

  let extra_number: number | null = null;

  const bonusBallNode = row.querySelector(".c-result__bonus .c-ball");
  if (bonusBallNode) {
    const bonusTxt = clean(bonusBallNode.textContent);
    const bonusNum = Number(bonusTxt);
    if (!Number.isNaN(bonusNum)) extra_number = bonusNum;
  }

  return {
    numbers: numbers.slice(0, mainNumbersCount),
    extra_number,
  };
}

function getPrimaryResultRow(document: Document): Element | null {
  return (
    document.querySelector(
      "#js-state-results-table tr.c-results-table__item.c-draw-card"
    ) ||
    document.querySelector("tr.c-draw-card") ||
    document.querySelector(".c-draw-card")
  );
}

// ===========================================================
// MAIN SCRAPER
// ===========================================================

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
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
      },
    });
  } catch {
    console.error(`❌ Erro ao acessar ${game.url}`);
    return false;
  }

  if (!resp.ok) {
    console.error(`❌ Erro HTTP ${resp.status} ao acessar ${game.url}`);
    return false;
  }

  const html = await resp.text();
  const { document } = parseHTML(html);

  // ===========================================================
  // CARD / ROW PRINCIPAL
  // ===========================================================
  const row = getPrimaryResultRow(document);
  if (!row) {
    console.log("⚠️ Nenhuma linha principal de resultado encontrada");
    return false;
  }

  // ===========================================================
  // DATA
  // ===========================================================
  const rawDate =
    row.querySelector(".c-result__table__date")?.textContent ??
    row.querySelector(".c-draw-card__draw-date")?.textContent ??
    row.querySelector(".c-draw-card__date")?.textContent ??
    "";

  const draw_date = parseDateToISO(rawDate);
  if (!draw_date) {
    console.log("⚠️ Não foi possível extrair a draw_date");
    return false;
  }

  // ===========================================================
  // NÚMEROS
  // ===========================================================
  let numbers: number[] = [];
  let extra_number: number | null = null;

  // Tratamento especial para páginas em formato tabela como millionaire4life
  if (
    game.game_id === "millionaire4life" ||
    game.game_id === "millionaire4life_ny" ||
    game.game_id === "millionaire4life_fl" ||
    game.game_id === "luckyforlife_oh" ||
    game.game_id === "luckyforlife_id"
  ) {
    const extracted = extractMainAndExtraFromRow(row, game.mainNumbers);
    numbers = extracted.numbers;
    extra_number = game.hasExtraBall ? extracted.extra_number : null;
  } else {
    const balls = [...row.querySelectorAll(".c-ball")]
      .map((el) => Number(clean(el.textContent)))
      .filter((n) => !Number.isNaN(n));

    numbers = balls.slice(0, game.mainNumbers);
    extra_number = game.hasExtraBall ? balls[game.mainNumbers] ?? null : null;
  }

  if (numbers.length !== game.mainNumbers) {
    console.log(
      `⚠️ Quantidade inválida de bolas para ${game.displayName}: ${numbers.length}/${game.mainNumbers}`
    );
    return false;
  }

  // ===========================================================
  // JACKPOT
  // ===========================================================
  let est_jackpot: string | null = null;
  let next_est_jackpot: string | null = null;
  let cash_value: string | null = null;

  const prizeLabel = clean(
    row.querySelector(".c-draw-card__metric-label")?.textContent
  );
  const prizeValue =
    clean(row.querySelector(".c-draw-card__prize-value")?.textContent) ||
    clean(row.querySelector(".c-draw-card__prize")?.textContent);

  const isTopPrize = prizeLabel?.toLowerCase().includes("top prize") ?? false;

  const looksFixedJackpot =
    prizeValue &&
    !prizeValue.toLowerCase().includes("million") &&
    !prizeValue.toLowerCase().includes("billion");

  const boxes = [...document.querySelectorAll(".c-state-short-info__box")];

  const hasNextJackpotBox = boxes.some((box) => {
    const t = clean(
      box.querySelector(".c-state-short-info__title")?.textContent
    )?.toLowerCase();
    return !!(t?.includes("next") && (t.includes("jackpot") || t.includes("top prize")));
  });

  const isFixed = isTopPrize || looksFixedJackpot || !hasNextJackpotBox;

  if (isFixed) {
    est_jackpot = prizeValue ?? null;
    next_est_jackpot = null;
    cash_value = null;
  } else {
    est_jackpot = prizeValue ?? null;

    const cashNode =
      document.querySelector(".c-state-short-info__subtitle--sub") ||
      document.querySelector(".c-state-short-info_subtitle");

    if (cashNode) {
      const txt = clean(cashNode.textContent);
      if (txt?.toLowerCase().includes("cash value")) {
        cash_value = findMoney(txt);
      }
    }

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
  // REGRAS ESPECIAIS — millionaire4life / lucky for life
  // ===========================================================
  if (
    [
      "millionaire4life",
      "millionaire4life_ny",
      "millionaire4life_fl",
      "luckyforlife_oh",
      "luckyforlife_id",
    ].includes(game.game_id)
  ) {
    est_jackpot = "$1 Million Per year for life";
    next_est_jackpot = "$1 Million";
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