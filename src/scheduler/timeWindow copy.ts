import { DateTime } from "luxon";
import { GameConfig } from "../types";

function timeToMinutesET(t: string): number {
  const [hhmm, ampm] = t.split(" ");
  let [h, m] = hhmm.split(":").map(Number);

  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;

  return h * 60 + m;
}

export function isWithinWindow(game: GameConfig) {
  const now = DateTime.now().setZone("America/New_York");
  const weekday = now.weekday % 7;

  if (!game.daysOfWeek.includes(weekday)) return false;

  const nowMin = now.hour * 60 + now.minute;
  const drawMin = timeToMinutesET(game.drawTimeET);

  const start = drawMin - 1;
  const end = drawMin + 45;

  return nowMin >= start && nowMin <= end;
}
