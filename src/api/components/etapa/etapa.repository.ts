import { AbsRepository } from "../helper";
import { getManager } from "typeorm";
import { Etapa } from "../../../entity/Etapa";

export class EtapaRepository extends AbsRepository<Etapa> {
    constructor(){
        super('Etapa',getManager().getRepository(Etapa))
    }
}