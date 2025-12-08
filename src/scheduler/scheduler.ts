import { ALL_GAMES } from "../states";
import { isWithinWindowAuto } from "./timeWindow";
import { scrapeGame } from "../utils/scrape";
import { saveResult } from "../supabase/save";
import { DateTime } from "luxon";

export async function runScheduler() {
  const nowET = DateTime.now().setZone("America/New_York");
  console.log(`\n⏱ Scheduler executado — ET ${nowET.toFormat("HH:mm:ss")}`);

  let totalChecked = 0;
  let totalUpdated = 0;
  let insideWindow = 0;
  let outsideWindow = 0;

  for (const game of ALL_GAMES) {
    totalChecked++;

    const inside = isWithinWindowAuto(game);

    if (inside) {
      insideWindow++;
      console.log(`🟩 Dentro da janela (${game.displayName})`);
    } else {
      outsideWindow++;
      console.log(`⚠️ Fora da janela (${game.displayName})`);
    }

    console.log(`🔍 Scraping: ${game.displayName}`);

    const scraped = await scrapeGame(game);

    if (!scraped) {
      console.log(`⏳ Scrape inválido ou sem dados retornados`);
      continue;
    }

    const updated = await saveResult(scraped);

    if (updated) {
      totalUpdated++;
      console.log(`✅ Novo resultado salvo: ${game.game_id}`);
    } else {
      console.log(`⏹ Nenhuma atualização — draw_date igual`);
    }
  }

  console.log("\n===============================");
  console.log(`📊 RESUMO`);
  console.log(`🔎 Jogos verificados: ${totalChecked}`);
  console.log(`🟩 Dentro da janela: ${insideWindow}`);
  console.log(`⚠️ Fora da janela: ${outsideWindow}`);
  console.log(`💾 Resultados atualizados: ${totalUpdated}`);
  console.log(`⏰ Horário ET: ${nowET.toFormat("HH:mm:ss")}`);
  console.log("===============================\n");

  // ⛔ FINALIZA O PROCESSO APÓS EXECUTAR UMA RODADA
  process.exit(0);
}
