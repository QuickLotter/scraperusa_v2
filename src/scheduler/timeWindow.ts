// src/scheduler/timeWindow.ts

export const FORCE_ALL = true; // ← FORÇAR TODOS OS JOGOS PARA TESTE

/**
 * Estrutura padrão das janelas por jogo.
 * Horários reais seriam usados quando FORCE_ALL = false.
 */
export const DRAW_WINDOWS: Record<string, { start: string; end: string }> = {
  //-----------------------
  // NEW YORK
  //-----------------------
  megamillions_ny: { start: "22:45", end: "23:59" },
  powerball_ny: { start: "22:30", end: "23:59" },
  cash4life_ny: { start: "20:45", end: "23:59" },
  pick10_ny: { start: "12:40", end: "13:59" },
  lotto_ny: { start: "22:00", end: "23:59" },
  take5midday_ny: { start: "14:00", end: "15:00" },
  take5evening_ny: { start: "22:30", end: "23:59" },
  win4midday_ny: { start: "14:00", end: "15:00" },
  win4evening_ny: { start: "22:30", end: "23:59" },
  numbersmidday_ny: { start: "14:00", end: "15:00" },
  numbersevening_ny: { start: "22:30", end: "23:59" },

  //-----------------------
  // PENNSYLVANIA
  //-----------------------
  pick2midday_pa: { start: "13:00", end: "14:00" },
  pick2evening_pa: { start: "18:50", end: "20:00" },
  pick3midday_pa: { start: "13:00", end: "14:00" },
  pick3evening_pa: { start: "18:50", end: "20:00" },
  pick4midday_pa: { start: "13:00", end: "14:00" },
  pick4evening_pa: { start: "18:50", end: "20:00" },
  pick5midday_pa: { start: "13:00", end: "14:00" },
  pick5evening_pa: { start: "18:50", end: "20:00" },
  treasurehunt_pa: { start: "12:30", end: "14:00" },
  cash5_pa: { start: "18:30", end: "20:00" },
  match6_pa: { start: "18:30", end: "20:00" },
  cash4life_pa: { start: "20:45", end: "23:59" },
  megamillions_pa: { start: "22:45", end: "23:59" },
  powerball_pa: { start: "22:30", end: "23:59" },
  powerball_db_pa: { start: "22:30", end: "23:59" },
};

/**
 * Função para verificar janela — mas se FORCE_ALL = true,
 * ela sempre retorna true.
 */
export function isWithinWindow(game_id: string): boolean {
  if (FORCE_ALL) return true;

  const window = DRAW_WINDOWS[game_id];
  if (!window) return false;

  const now = new Date();
  const [h, m] = now.toTimeString().slice(0, 5).split(":").map(Number);

  const nowTotal = h * 60 + m;
  const [sh, sm] = window.start.split(":").map(Number);
  const [eh, em] = window.end.split(":").map(Number);

  const startTotal = sh * 60 + sm;
  const endTotal = eh * 60 + em;

  return nowTotal >= startTotal && nowTotal <= endTotal;
}
