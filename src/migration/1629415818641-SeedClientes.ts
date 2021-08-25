import {getRepository, MigrationInterface, QueryRunner} from "typeorm";
import { clientesSeed } from "./seeds/cliente.seed";
export class SeedClientes1629415818641 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await getRepository("Cliente").save(clientesSeed);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
