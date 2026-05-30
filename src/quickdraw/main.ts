import "dotenv/config";
import { startQuickDrawWatcher } from "./quickdrawWatcher";

console.log("🎱 Quick Draw Watcher — ScraperUSA v2");
console.log("===============================");

startQuickDrawWatcher().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
