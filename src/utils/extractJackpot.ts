import { JSDOM } from "jsdom";

function clean(t: string | null | undefined): string | null {
  if (!t) return null;
  return t.replace(/\s+/g, " ").trim();
}

export function extractJackpotInfo(html: string) {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  let est_jackpot: string | null = null;
  let next_est_jackpot: string | null = null;
  let cash_value: string | null = null;
  let next_cash_value: string | null = null;

  // Jackpot atual
  const jackpotNodes = [
    ...document.querySelectorAll(".c-game-result-card__prize p"),
  ];

  for (const p of jackpotNodes) {
    const label = clean(p.childNodes[0]?.textContent || "");
    const strong = clean(p.querySelector("strong")?.textContent || "");

    if (!label || !strong) continue;

    if (label.includes("Top prize")) {
      est_jackpot = strong;
      next_est_jackpot = strong;
    }

    if (
      label.includes("Est. jackpot") ||
      (label.includes("Jackpot") && !label.includes("Next"))
    ) {
      est_jackpot = strong;
    }
  }

  // Cash value atual
  const cashNode = document.querySelector(".c-state-short-info_subtitle");

  if (cashNode) {
    const txt = clean(cashNode.textContent);
    if (txt?.includes("Cash value:")) {
      cash_value = txt.replace("Cash value:", "").trim();
    }
  }

  // Próximo Jackpot
  const nextBoxes = [...document.querySelectorAll(".c-state-short-info__box")];

  for (const box of nextBoxes) {
    const title = clean(
      box.querySelector(".c-state-short-info__title")?.textContent || ""
    );
    const value = clean(
      box.querySelector(".c-state-short-info__subtitle")?.textContent || ""
    );

    if (!title || !value) continue;

    // CORREÇÃO: só pega blocos de jackpot VERDADEIROS
    if (
      title.includes("Next") &&
      (title.toLowerCase().includes("jackpot") ||
        title.toLowerCase().includes("est. jackpot"))
    ) {
      const match = value.match(/\$\s*\d[\d,\.]*/);
      if (match) {
        next_est_jackpot = match[0];
      }
    }

    // Próximo cash value
    if (title.toLowerCase().includes("cash value")) {
      const matchCash = value.match(/\$\s*\d[\d,\.]*/);
      if (matchCash) {
        next_cash_value = matchCash[0];
      }
    }
  }

  return {
    est_jackpot,
    cash_value,
    next_est_jackpot,
    next_cash_value,
  };
}
