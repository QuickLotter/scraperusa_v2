import { GameDefinition } from "../types";

// DESLIGADO — respeita horário real
export const FORCE = false;

export function isWithinWindow(game: GameDefinition) {
  if (FORCE) return true;

  const now = new Date();
  const dow = now.getDay();

  if (!game.daysOfWeek.includes(dow)) return false;

  const [h, m] = game.drawTimeET.split(":");
  const drawHour = parseInt(h);
  const drawMin = parseInt(m);

  const winStart = new Date();
  winStart.setHours(drawHour - 1, drawMin, 0); // 1h antes

  const winEnd = new Date();
  winEnd.setHours(drawHour + 2, drawMin, 0); // 2h depois

  return now >= winStart && now <= winEnd;
}
