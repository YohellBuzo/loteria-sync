import { db } from "./db.js";
import { log } from "./logger.js";

async function syncRecent() {
  log("Creando las tablas...");

  try {
    // await db.query(
    //   `CREATE TABLE Sorteos_Loteria ( id SERIAL PRIMARY KEY, numero_sorteo TEXT UNIQUE NOT NULL, fecha DATE NOT NULL );`
    // );
    // log("Tabla Sorteos_Loteria creada");

    await db.query(
      `CREATE TABLE Numeros_Ganadores_Loteria ( id SERIAL PRIMARY KEY, numero TEXT NOT NULL, premio TEXT NOT NULL, serie TEXT NOT NULL, sorteo_id INTEGER NOT NULL, FOREIGN KEY (sorteo_id) REFERENCES Sorteos_Loteria(id) );`
    );
    log("Tabla Numeros_Ganadores_Loteria creada");
  } catch (err) {
    if (err.code === "23505") {
      // duplicado, ignorar
    } else {
      throw err;
    }
  }

  log("Todo bien.");
}

syncRecent().then(() => process.exit());
