import { ALL_GAMES } from "./states";
import { scrapeGame } from "./utils/scrape";
import { saveResult } from "./supabase/save";
import { DateTime } from "luxon";

async function forceRun() {
  console.log(
    `\n🔥 FORCED SCRAPER RUN — ET ${DateTime.now()
      .setZone("America/New_York")
      .toFormat("HH:mm:ss")}\n`
  );

  let updated = 0;
  let total = 0;

  for (const game of ALL_GAMES) {
    total++;

    const fullName = `${game.displayName} (${game.state})`;
    console.log(`➡️ Forçando scrape: ${fullName}`);
    console.log(`🔍 Scraping: ${fullName}`);

    try {
      const scraped = await scrapeGame(game);

      if (!scraped) {
        console.log(`⚠️ Falha ao scrape ${fullName}`);
        continue;
      }

      // Passa o game para rotear para a tabela correta
      const saved = await saveResult(scraped, game);

      if (saved) {
        updated++;
        console.log(`✅ Novo resultado salvo: ${fullName}`);
      } else {
        console.log(`⏹ Nada novo — draw_date igual (${fullName})`);
      }
    } catch (err: any) {
      console.log(`❌ ERRO ao processar ${fullName}:`, err);
    }
  }

  console.log("\n===============================");
  console.log(`📊 RESUMO FORÇADO`);
  console.log(`Jogos verificados: ${total}`);
  console.log(`Atualizados: ${updated}`);
  console.log("===============================\n");
}

forceRun();
