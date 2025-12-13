// src/supabase/save.ts
import { supabase } from "./supabaseClient";
import { ScrapedResult } from "../types";

/**
 * Salva no banco APENAS se houver mudança real
 */
export async function saveResult(result: ScrapedResult): Promise<boolean> {
  const { game_id, draw_date } = result;

  // Busca o registro existente
  const { data: existing } = await supabase
    .from("results_all")
    .select("*")
    .eq("game_id", game_id)
    .eq("draw_date", draw_date)
    .maybeSingle();

  // 1️⃣ Não existe → inserir
  if (!existing) {
    console.log(
      `🟢 Novo resultado encontrado → insert ${game_id} ${draw_date}`
    );
    const { error } = await supabase.from("results_all").insert([result]);
    if (error) throw error;
    return true;
  }

  // 2️⃣ Existe → verificar se mudou
  const changed =
    JSON.stringify(existing.numbers) !== JSON.stringify(result.numbers) ||
    existing.extra_number !== result.extra_number ||
    (existing.est_jackpot || "") !== (result.est_jackpot || "") ||
    (existing.cash_value || "") !== (result.cash_value || "") ||
    (existing.next_est_jackpot || "") !== (result.next_est_jackpot || "");

  if (!changed) {
    console.log(`⏹ Sem mudanças → ignorado ${game_id} ${draw_date}`);
    return false;
  }

  // 3️⃣ Atualizar somente se mudou
  console.log(`🟡 Mudança detectada → update ${game_id} ${draw_date}`);

  const { error } = await supabase
    .from("results_all")
    .update(result)
    .eq("game_id", game_id)
    .eq("draw_date", draw_date);

  if (error) throw error;
  return true;
}
