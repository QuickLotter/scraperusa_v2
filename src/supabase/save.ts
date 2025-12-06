import { supabase } from "./supabaseClient";
import { ScrapedResult } from "../types";

export async function saveResult(result: ScrapedResult): Promise<boolean> {
  const { data: existing } = await supabase
    .from("results_all")
    .select("draw_date")
    .eq("game_id", result.game_id)
    .eq("draw_date", result.draw_date)
    .maybeSingle();

  if (existing) return false;

  const { error } = await supabase.from("results_all").upsert(result);

  if (error) throw error;

  return true;
}
