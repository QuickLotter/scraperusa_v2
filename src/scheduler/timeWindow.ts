export const FORCE_ALL = false; // deixe true apenas para testes rápidos

function parseETToMinutes(timeET: string): number {
  const [hm, ampm] = timeET.split(" ");
  let [h, m] = hm.split(":").map(Number);

  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;

  return h * 60 + m;
}

// Janela de scraping: 15 min antes e até 60 min depois do sorteio
function generateWindow(drawTimeET: string) {
  const draw = parseETToMinutes(drawTimeET);
  return {
    start: draw - 15,
    end: draw + 60,
  };
}

export function isWithinWindowAuto(game: any): boolean {
  if (FORCE_ALL) return true;

  const now = new Date();
  const nowTotal = now.getHours() * 60 + now.getMinutes();

  const { start, end } = generateWindow(game.drawTimeET);

  // Janelas que passam meia-noite
  if (end >= 1440) {
    return nowTotal >= start || nowTotal <= end - 1440;
  }

  return nowTotal >= start && nowTotal <= end;
}
