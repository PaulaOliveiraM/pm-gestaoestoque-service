import { Entrega, EntregaStatus } from "../../../entity/Entrega";
import { EtapasEntrega } from "../../../entity/Etapa";
import { EtapaRepository } from "../etapa/etapa.repository";
import { RastreioRepository } from "../rastreio/rastreio.repository";
import { EntregaRepository } from "./entrega.repository";
import { generate } from "randomstring";
import { BaixaEntrega } from "./entrega.model";

export interface IEntregaService {
  iniciarEntrega(entrega: Entrega): Promise<Entrega>;
  consultarEntrega(codigoEntrega: Number): Promise<Entrega>;
  baixarEntrega(baixaEntrega: BaixaEntrega): Promise<Entrega>;
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

  async  baixarEntrega(baixaEntrega: BaixaEntrega): Promise<Entrega>{
    const entrega = await this.entregaRep.read({where: {id: baixaEntrega.codigoEntrega}, relations:["rastreios"]});
    if (!entrega){
      throw new Error("Entrega não localizada");
    }

    if (entrega.status == EntregaStatus.Concluida){
      throw new Error("A entrega já encontra-se em baixa");
    }

    entrega.status = EntregaStatus.Concluida;
    entrega.dataEntrega = new Date();
    
    await this.entregaRep.save(entrega);

    await this.etapaRep.save({
      data: new Date(),
      entrega: entrega,
      etapa:  EtapasEntrega.EntregaFinalizada,
      latitude: baixaEntrega.latitude,
      longitude: baixaEntrega.longitude,
      usuarioResponsavel: baixaEntrega.usuario,
      id: 0,
      observacoes: baixaEntrega.observacao
    })

    if (entrega.rastreios.length > 0){
      await this.rastreioRep.save({
        codigoRastreio: entrega.rastreios[0].codigoRastreio,
        dataRastreio: new Date(),
        entrega:  entrega,
        latitude: baixaEntrega.latitude,
        longitude:  baixaEntrega.longitude,
        id: 0
      })
    }

    return  entrega;

  }

  async consultarEntrega(codigoEntrega: number): Promise<Entrega> {
      const entregaLocalizada =  await this.entregaRep.read({where: {id: codigoEntrega}, relations: ["etapas","rastreios"] })
      return entregaLocalizada;
  }

  async iniciarEntrega(entrega: Entrega): Promise<Entrega> {

      //TODO: pegar as coordenadas do endereço do armazem informado na entrega, para isso, acionar o serviço de geolocalização
      entrega.status = EntregaStatus.Iniciada;
      entrega.dataPrevistaEntrega = this.calcularDataPrevistaEntrega(new Date());
      const entregaRetorno = await this.entregaRep.save(entrega);
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
     

      return entregaRetorno;

  }

  private calcularDataPrevistaEntrega(dataInicioEntrega: Date) : Date {
    return new Date(dataInicioEntrega.setDate(dataInicioEntrega.getDate()+10));
  }
}
