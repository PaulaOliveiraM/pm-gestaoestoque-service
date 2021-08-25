import { Cliente } from "../../../entity/Cliente";
import { Entrega, EntregaStatus } from "../../../entity/Entrega";
import { EtapasEntrega } from "../../../entity/Etapa";
import { EtapaRepository } from "../etapa/etapa.repository";
import { RastreioRepository } from "../rastreio/rastreio.repository";
import { EntregaRepository } from "./entrega.repository";
import { generate } from "randomstring";

export interface IEntregaService {
  iniciarEntrega(entrega: Entrega): Promise<Entrega>;
}

export class EntregaService implements IEntregaService {
  entregaRep: EntregaRepository;
  etapaRep: EtapaRepository;
  rastreioRep: RastreioRepository;

  constructor() {
    this.entregaRep = new EntregaRepository();
    this.etapaRep = new EtapaRepository();
    this.rastreioRep = new RastreioRepository();
  }

  async iniciarEntrega(entrega: Entrega): Promise<Entrega> {
    try {
      //TODO: pegar as coordenadas do endereço do armazem informado na entrega, para isso, acionar o serviço de geolocalização
      entrega.status = EntregaStatus.Iniciada;
      entrega.dataPrevistaEntrega = this.calcularDataPrevistaEntrega(new Date());
      await this.entregaRep.save(entrega);
      await this.etapaRep.save({
        data: new Date(),
        etapa: EtapasEntrega.EntregaIniciada,
        usuarioResponsavel: "admin",
        latitude: 2,
        longitude: 3,
        entrega: entrega,
        id: 0,
      });
      await this.rastreioRep.save({
        codigoRastreio: generate(10),
        dataRastreio: new Date(),
        entrega: entrega,
        id: 0,
        latitude: 1,
        longitude: 2,
      });
    } catch (error) {
      throw error;
    }

    return entrega;
  }

  private calcularDataPrevistaEntrega(dataInicioEntrega: Date) : Date {
    return new Date(dataInicioEntrega.setDate(dataInicioEntrega.getDate()+10));
  }
}
