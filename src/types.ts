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
}

export interface ScrapedResult {
  game_id: string;
  draw_date: string;
  numbers: number[];
  extra_number: number | null;
  est_jackpot: string | null;
  cash_value: string | null;
  next_est_jackpot: string | null;
}
