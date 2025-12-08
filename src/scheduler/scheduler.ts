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

  for (const game of ALL_GAMES) {
    totalChecked++;

    const inside = isWithinWindowAuto(game);

    if (!inside) {
      console.log(`⏸ Fora da janela — ignorando ${game.displayName}`);
      continue; // <<<<<< AQUI — NÃO FAZ REQUEST FORA DA JANELA
    }

    console.log(`🟢 Dentro da janela — scraping ${game.displayName}`);

    const scraped = await scrapeGame(game);

    if (!scraped) {
      console.log(`⚠️ Scrape inválido ${game.displayName}`);
      continue;
    }

    const updated = await saveResult(scraped);

    if (updated) {
      totalUpdated++;
      console.log(`✅ Novo resultado salvo: ${game.game_id}`);
    } else {
      console.log(`⏹ Nenhuma atualização para ${game.game_id}`);
    }
  }

  console.log(`\n📊 RESUMO`);
  console.log(`🔎 Jogos verificados: ${totalChecked}`);
  console.log(`💾 Resultados atualizados: ${totalUpdated}`);
  console.log(`⏰ Horário ET: ${nowET.toFormat("HH:mm:ss")}`);
  console.log(`===============================\n`);
}
