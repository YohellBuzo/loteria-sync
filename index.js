import "dotenv/config";
import cron from "node-cron";
import { syncHistorical } from "./src/syncHistorical.js";
import { log } from "./src/logger.js";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

async function main() {
  log("Servidor iniciado 🟢");

  await syncHistorical();

  cron.schedule("*/5 * * * *", async () => {
    log("⏰ Ejecutando sincronización automática...");
    await syncHistorical();
  });
}

app.get("/", (req, res) => {
  res.send("🟢 Lotería sync en ejecución");
});

app.listen(PORT, () => {
  log(`Servidor escuchando en puerto ${PORT}`);
  main();
});
