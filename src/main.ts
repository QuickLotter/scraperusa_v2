import "dotenv/config";
import { runScheduler } from "./scheduler/scheduler";

console.log("🚀 ScraperUSA iniciado\n===============================");

async function main() {
  await runScheduler();
}

main();

export default main;
