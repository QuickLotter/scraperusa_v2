// src/types.ts

export interface GameDefinition {
  game_id: string;
  state: string;
  displayName: string;
  url: string;
  mainNumbers: number;
  hasExtraBall: boolean;
  supportsCashValue?: boolean;
  drawTimeET: string;
  daysOfWeek: number[];
  /** Tabela Supabase de destino. Default: "results_all" */
  table?: string;
  /** Para jogos com múltiplos sorteios por dia (ex: Quick Draw) */
  multiDrawPerDay?: boolean;
}

export interface ScrapedResult {
  game_id: string;
  draw_date: string;
  numbers: number[];
  extra_number: number | null;
  est_jackpot: string | null;
  cash_value: string | null;
  next_est_jackpot: string | null;
  /** Número único do sorteio (ex: Quick Draw draw number) */
  draw_number?: number | null;
  /** Horário do sorteio (ex: Quick Draw) */
  draw_time?: string | null;
  /** Multiplicador (ex: Quick Draw Money Dots) */
  multiplier?: string | null;
}
