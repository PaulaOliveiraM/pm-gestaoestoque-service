export class BaixaEntrega {
  codigoEntrega: number;
  usuario: string;
  latitude: number;
  longitude: number;
  observacao: string;

  constructor(
    codigoEntrega: number,
    user: string,
    latitude: number,
    longitude: number,
    observacao: string
  ) {
      this.codigoEntrega = codigoEntrega;
      this.usuario = user;
      this.latitude = latitude;
      this.longitude = longitude;
      this.observacao = observacao;
  }
}
