import {getRepository, MigrationInterface, QueryRunner} from "typeorm";
import { armazemSeed } from "./seeds/armazem.seed";

export class SeedArmazens1629417448717 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await getRepository("Armazem").save(armazemSeed);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
