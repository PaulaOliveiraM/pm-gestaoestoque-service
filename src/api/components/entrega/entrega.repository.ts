import { AbsRepository } from "../helper";
import { getManager } from "typeorm";
import { Entrega } from "../../../entity/Entrega";
export class EntregaRepository extends AbsRepository<Entrega> {
    constructor(){
        super('Entrega',getManager().getRepository(Entrega))
    }
}