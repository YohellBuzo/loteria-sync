import { db } from "./db.js";
import { getByDrawId } from "./api.js";
import { log } from "./logger.js";

async function syncHistorical() {
  const { rows } = await db.query(
    "SELECT last_synced_draw FROM sync_status WHERE id = 1"
  );

  let last = rows[0].last_synced_draw;
  let next = last + 1;

  log("Buscando sorteo histórico:", next);

  const data = await getByDrawId(next);

  if (!data) {
    log("No existe el sorteo", next, "se detiene por hoy.");
    return process.exit();
  }

  await db.query(
    `INSERT INTO lottery_results (draw_id, draw_date, lottery_type, result)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (draw_id) DO NOTHING`,
    [
      data.id,
      data.fecha,
      data.tipo,
      JSON.stringify(data.numeros)
    ]
  );

  await db.query(
    "UPDATE sync_status SET last_synced_draw = $1 WHERE id = 1",
    [next]
  );

  log("Histórico agregado:", next);

  process.exit();
}

syncHistorical();
