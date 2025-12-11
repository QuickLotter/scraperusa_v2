import { ALL_GAMES } from "../states";
import { isWithinWindowAuto } from "./timeWindow";
import { scrapeGame } from "../utils/scrape";
import { saveResult } from "../supabase/save";
import { DateTime } from "luxon";

export async function runScheduler() {
  const nowET = DateTime.now().setZone("America/New_York");
  console.log(`\n⏱ Scheduler executado — ET ${nowET.toFormat("HH:mm:ss")}`);

  let totalChecked = 0;
  let totalScraped = 0;
  let totalUpdated = 0;

  for (const game of ALL_GAMES) {
    totalChecked++;

    const fullName = `${game.displayName} (${game.state})`;

    const inside = isWithinWindowAuto(game);

    if (!inside) {
      console.log(`⛔ Fora da janela — ${fullName} ignorado`);
      continue;
    }

    console.log(`🟢 Dentro da janela — Scraping: ${fullName}`);

    const scraped = await scrapeGame(game);

    if (!scraped) {
      console.log(`⚠️ Scrape inválido para ${fullName}`);
      continue;
    }

    const updated = await saveResult(scraped);

    if (updated) {
      totalUpdated++;
      console.log(`✅ Resultado salvo para: ${fullName}`);
    } else {
      console.log(`⏹ Nada novo — draw_date igual (${fullName})`);
    }
  }

  console.log("\n===============================");
  console.log(`📊 RESUMO`);
  console.log(`🔍 Jogos analisados: ${totalChecked}`);
  console.log(`🟢 Jogos dentro da janela (scrapeados): ${totalScraped}`);
  console.log(`💾 Resultados atualizados: ${totalUpdated}`);
  console.log(`⏰ Horário ET: ${nowET.toFormat("HH:mm:ss")}`);
  console.log("===============================\n");
}

// 🔥 PERMITE EXECUTAR LOCALMENTE
if (require.main === module) {
  runScheduler();
}
