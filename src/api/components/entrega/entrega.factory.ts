
import { EtapaRepository } from "../etapa/etapa.repository";
import { RastreioRepository } from "../rastreio/rastreio.repository";
import { EntregaRepository } from "./entrega.repository";
import { IEntregaService, EntregaService } from "./entrega.service";

export class EntregaFactory {
    private static entregaService: IEntregaService;
    public static makeEntregaService():IEntregaService{
        if (this.entregaService){
            return this.entregaService;
        }

        this.entregaService = new EntregaService();

        return this.entregaService;
    }
}