import "dotenv/config";
import { startQuickDrawWatcher, importHistory } from "./quickdrawWatcher";

console.log("🎱 Quick Draw Watcher — ScraperUSA v2");
console.log("===============================\n");

async function main() {
  // Importar histórico primeiro (3000 resultados = 120 páginas de 25)
  await importHistory(120);

  // Depois iniciar o watcher em tempo real
  await startQuickDrawWatcher();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
