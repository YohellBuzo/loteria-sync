class Numero_Ganador {
  constructor(id, numero, premio, serie, sorteo_id) {
    this.numero = numero;
    this.premio = premio;
    this.serie = serie;
    this.sorteo = numero_sorteo;
  }

  static createFromObject(object) {
    return new Numero_Ganador(object.numero, object.tipo, object.serie, object.sorteo);
  }

  static createFromJSON(object) {
    return new Numero_Ganador(
      object.numero,
      object.tipo,
      object.serie,
      object.sorteo
    );
  }
}
