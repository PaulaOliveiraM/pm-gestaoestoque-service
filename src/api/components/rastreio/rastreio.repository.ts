import { AbsRepository } from "../helper";
import { getManager } from "typeorm";
import { Rastreio } from "../../../entity/Rastreio";

export class RastreioRepository extends AbsRepository<Rastreio> {
    constructor(){
        super('Rastreio',getManager().getRepository(Rastreio))
    }
}