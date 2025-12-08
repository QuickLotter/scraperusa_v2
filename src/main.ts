import "dotenv/config";
import { runScheduler } from "./scheduler/scheduler";

console.log("🚀 ScraperUSA iniciado\n===============================");

async function main() {
  await runScheduler();
  process.exit(0); // <-- ESSENCIAL! PM2 só reinicia se terminar.
}

main();
export default main;
import "dotenv/config";
import { runScheduler } from "./scheduler/scheduler";

console.log("🚀 ScraperUSA iniciado\n===============================");

async function main() {
  await runScheduler();
  process.exit(0); // <-- ESSENCIAL! PM2 só reinicia se terminar.
}

main();
export default main;
