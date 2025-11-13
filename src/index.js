import "dotenv/config";
import cron from "node-cron";
import { syncHistorical } from "./src/syncHistorical.js";
import { log } from "./src/logger.js";

async function main() {
  log("Servidor iniciado 🟢");

  // Ejecutar una vez al arrancar
  await syncHistorical();

  // Ejecutar cada 6 horas (ejemplo)
  cron.schedule("*/5 * * * *", async () => {
    log("⏰ Ejecutando sincronización automática...");
    await syncHistorical();
  });
}

main();
