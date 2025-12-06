import { ALL_GAMES } from "../states";
import { isWithinWindow } from "./timeWindow";
import { scrapeGame } from "../utils/scrape";
import { saveResult } from "../supabase/save";

export async function runScheduler() {
  console.log(`⏱ Scheduler executado às ${new Date().toLocaleTimeString()}`);

  for (const game of ALL_GAMES) {
    if (!isWithinWindow(game.game_id)) {
      console.log(`⏭ Fora da janela (${game.displayName})`);
      continue;
    }

    console.log(`🔍 Scrape: ${game.displayName} (${game.game_id})`);

    const scraped = await scrapeGame(game);

    if (!scraped) {
      console.log(`⏳ Nenhuma mudança ou scrape inválido: ${game.game_id}`);
      continue;
    }

    const updated = await saveResult(scraped);

    if (updated) {
      console.log(`✅ Atualizado: ${game.game_id}`);
    } else {
      console.log(`⏹ Nenhuma atualização — já é o mesmo draw_date`);
    }
  }

  console.log("🏁 Ciclo concluído.");
}
