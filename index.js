import "dotenv/config";
import cron from "node-cron";
import { syncHistorical } from "./src/syncHistorical.js";
import { log } from "./src/logger.js";

async function main() {
  log("Servidor iniciado 🟢");

  await syncHistorical();

  cron.schedule("*/5 * * * *", async () => {
    log("⏰ Ejecutando sincronización automática...");
    await syncHistorical();
  });
}

main();
