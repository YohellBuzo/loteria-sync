import { db } from "./db.js";
import { getRecentMonth } from "./api.js";
import { log } from "./logger.js";

async function syncRecent() {
  log("Sincronizando últimos 30 días…");

  const sorteos = await getRecentMonth();

  for (const sorteo of sorteos) {
    try {
      sorteo.premios.sort((a, b) => Number(a.tipo) - Number(b.tipo));

      await db.query(
        `INSERT INTO sorteos_loteria (numero_sorteo, fecha) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
        [sorteo.numeroSorteo, sorteo.fecha]
      );

      const inserts = sorteo.premios.slice(0, 3).map((numero_ganador) => {
        return db.query(
          `INSERT INTO numeros_ganadores_loteria (numero, premio, serie, numero_sorteo) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING`,
          [
            numero_ganador.numero,
            numero_ganador.tipo,
            numero_ganador.serie,
            sorteo.numeroSorteo,
          ]
        );
      });
      await Promise.all(inserts);

      log("Nuevo sorteo agregado:", sorteo.numeroSorteo);
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
