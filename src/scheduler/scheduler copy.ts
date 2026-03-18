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

    const fullName = `${game.displayName} (${game.state})`;

    const inside = isWithinWindowAuto(game);

    if (!inside) {
      console.log(`🔸 Fora da janela — mas será scrapeado: ${fullName}`);
    } else {
      console.log(`🟢 Dentro da janela — scrape normal: ${fullName}`);
    }

    // Scrape SEMPRE
    const scraped = await scrapeGame(game);

    if (!scraped) {
      console.log(`⚠️ Scrape inválido para ${fullName}`);
      continue;
    }

    const updated = await saveResult(scraped);

    if (updated) {
      totalUpdated++;
      console.log(`✅ Registro salvo/atualizado para: ${fullName}`);
    } else {
      console.log(`⏹ Nenhuma mudança encontrada em ${fullName}`);
    }
  }

  console.log("\n===============================");
  console.log(`📊 RESUMO`);
  console.log(`🔍 Jogos analisados: ${totalChecked}`);
  console.log(`💾 Registros salvos/atualizados: ${totalUpdated}`);
  console.log(`⏰ Horário ET: ${nowET.toFormat("HH:mm:ss")}`);
  console.log("===============================\n");
}

// 🔥 Permite executar localmente
if (require.main === module) {
  runScheduler();
}
