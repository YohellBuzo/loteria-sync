class Sorteo_Loteria {
  constructor(id, numero_sorteo, fecha) {
    this.numero_sorteo = numero_sorteo;
    this.fecha = fecha;
  }

  static createFromObject(object) {
    return new Sorteo_Loteria(object.numeroSorteo, object.fecha);
  }
}
