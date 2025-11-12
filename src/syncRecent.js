import { db } from "./db.js";
import { getRecentMonth } from "./api.js";
import { log } from "./logger.js";

async function syncRecent() {
  log("Sincronizando últimos 30 días…");

  const results = await getRecentMonth();

  for (const draw of results) {
    try {
      await db.query(
        `INSERT INTO lottery_results (draw_id, draw_date, lottery_type, result)
         VALUES ($1, $2, $3, $4)`,
        [
          draw.id,
          draw.fecha,
          draw.tipo,
          JSON.stringify(draw.numeros)
        ]
      );
      log("Nuevo sorteo agregado:", draw.id);
    } catch (err) {
      if (err.code === "23505") {
        // duplicado, ignorar
      } else {
        throw err;
      }
    }
  }

  log("Sincronización reciente completada.");
}

syncRecent().then(() => process.exit());