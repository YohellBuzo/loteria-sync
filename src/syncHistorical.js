import { db } from "./db.js";
import { getByDrawNumber } from "./api.js";
import { log } from "./logger.js";

export async function syncHistorical() {
  try {
    const { rows } = await db.query(
      "SELECT numero_sorteo FROM sincronizacion;"
    );

    let last = rows[0].numero_sorteo;
    let next = Number(last) + 1;

    log("Buscando sorteo histórico:", next);

    const sorteo = await getByDrawNumber(next);
    sorteo.premios.sort((a, b) => Number(a.tipo) - Number(b.tipo));

    if (!sorteo) {
      log("No existe el sorteo", next, "se detiene por hoy.");
      return process.exit();
    }

    await db.query(
      `INSERT INTO sorteos_loteria (numero_sorteo, fecha)
     VALUES ($1, $2)
     ON CONFLICT (id) DO NOTHING`,
      [sorteo.numeroSorteo, sorteo.fecha]
    );

    const inserts = sorteo.premios.slice(0, 3).map((numero_ganador) => {
      return db.query(
        `INSERT INTO numeros_ganadores_loteria (numero, premio, serie, numero_sorteo)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO NOTHING`,
        [
          numero_ganador.numero,
          numero_ganador.tipo,
          numero_ganador.serie,
          sorteo.numeroSorteo,
        ]
      );
    });

    await Promise.all(inserts);

    await db.query(
      "UPDATE sincronizacion SET numero_sorteo = $1 WHERE id = 1",
      [next]
    );

    log("Histórico agregado:", next);
  } catch (error) {
    if (err.code === "23505") {
      // duplicado, ignorar
    } else {
      throw err;
    }
  }

  process.exit();
}
