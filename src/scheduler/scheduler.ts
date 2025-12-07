//src/scheduler/scheduler.ts
import { ALL_GAMES } from "../states";
import { isWithinWindowAuto } from "./timeWindow";
import { scrapeGame } from "../utils/scrape";
import { saveResult } from "../supabase/save";

export async function runScheduler() {
  console.log(`⏱ Scheduler executado às ${new Date().toLocaleTimeString()}`);

  for (const game of ALL_GAMES) {
    if (!isWithinWindowAuto(game)) {
      console.log(`⏭ Fora da janela (${game.displayName})`);
      continue;
    }

    console.log(`🔍 Scraping: ${game.displayName}`);

    const scraped = await scrapeGame(game);
    if (!scraped) {
      console.log(`⏳ Nenhuma mudança / scrape inválido`);
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
