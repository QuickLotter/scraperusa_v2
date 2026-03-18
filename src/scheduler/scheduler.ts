import { ALL_GAMES } from "../states";
import { isWithinWindowAuto } from "./timeWindow";
import { scrapeGame } from "../utils/scrape";
import { saveResult } from "../supabase/save";
import { DateTime } from "luxon";

export async function runScheduler() {
  const nowET = DateTime.now().setZone("America/New_York");
  console.log(`\n⏰ Scheduler executado — ET ${nowET.toFormat("HH:mm:ss")}`);

  let totalChecked = 0;
  let totalEligible = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const game of ALL_GAMES) {
    totalChecked++;

    const fullName = `${game.displayName} (${game.state})`;
    const inside = isWithinWindowAuto(game);

    if (!inside) {
      totalSkipped++;
      console.log(`⏭️ Fora da janela — ignorado: ${fullName}`);
      continue;
    }

    totalEligible++;
    console.log(`🟢 Dentro da janela — scrape normal: ${fullName}`);

    try {
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
        console.log(`⬜ Nenhuma mudança encontrada em ${fullName}`);
      }
    } catch (error) {
      totalErrors++;
      console.error(`❌ Erro ao processar ${fullName}:`, error);
      continue;
    }
  }

  console.log("\n==============================");
  console.log("📊 RESUMO");
  console.log(`🔎 Jogos analisados: ${totalChecked}`);
  console.log(`🎯 Dentro da janela: ${totalEligible}`);
  console.log(`⏭️ Ignorados fora da janela: ${totalSkipped}`);
  console.log(`💾 Registros salvos/atualizados: ${totalUpdated}`);
  console.log(`❌ Erros: ${totalErrors}`);
  console.log(`🕒 Horário ET: ${nowET.toFormat("HH:mm:ss")}`);
  console.log("==============================\n");
}

if (require.main === module) {
  runScheduler();
}