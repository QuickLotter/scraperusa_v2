// src/supabase/save.ts
import { supabase } from "./supabaseClient";
import { GameDefinition, ScrapedResult } from "../types";

/**
 * Salva no banco APENAS se houver mudança real.
 * A tabela de destino é definida por game.table (default: "results_all").
 */
export async function saveResult(
  result: ScrapedResult,
  game: GameDefinition
): Promise<boolean> {
  const { game_id, draw_date } = result;
  const table = game.table ?? "results_all";

  // Busca o registro existente
  const { data: existing } = await supabase
    .from(table)
    .select("*")
    .eq("game_id", game_id)
    .eq("draw_date", draw_date)
    .maybeSingle();

  // 1️⃣ Não existe → inserir
  if (!existing) {
    console.log(
      `🟢 Novo resultado encontrado → insert [${table}] ${game_id} ${draw_date}`
    );
    const { error } = await supabase.from(table).insert([result]);
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
    console.log(`⏹ Sem mudanças → ignorado [${table}] ${game_id} ${draw_date}`);
    return false;
  }

  // 3️⃣ Atualizar somente se mudou
  console.log(`🟡 Mudança detectada → update [${table}] ${game_id} ${draw_date}`);

  const { error } = await supabase
    .from(table)
    .update(result)
    .eq("game_id", game_id)
    .eq("draw_date", draw_date);

  if (error) throw error;
  return true;
}
