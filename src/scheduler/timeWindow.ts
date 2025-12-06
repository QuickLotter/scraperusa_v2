// src/scheduler/timeWindow.ts

export const FORCE_ALL = false; // ← deixe true apenas para testes

/**
 * Converte "09:00 PM" → minutos totais (ex: 1260)
 */
function parseETToMinutes(timeET: string): number {
  const [hm, ampm] = timeET.split(" ");
  let [h, m] = hm.split(":").map(Number);

  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;

  return h * 60 + m;
}

/**
 * Gera a janela automaticamente:
 * start = drawTimeET - 15 min
 * end   = drawTimeET + 60 min
 */
function generateWindow(drawTimeET: string) {
  const draw = parseETToMinutes(drawTimeET);
  const start = draw - 15;
  const end = draw + 60;

  return { start, end };
}

/**
 * Verifica se estamos dentro da janela automática
 */
export function isWithinWindowAuto(game: any): boolean {
  if (FORCE_ALL) return true;

  const now = new Date();
  const nowTotal = now.getHours() * 60 + now.getMinutes();

  const { start, end } = generateWindow(game.drawTimeET);

  // Lida com janelas que atravessam meia-noite
  if (end >= 24 * 60) {
    return nowTotal >= start || nowTotal <= end - 1440;
  }

  return nowTotal >= start && nowTotal <= end;
}
