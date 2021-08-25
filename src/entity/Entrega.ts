import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, CreateDateColumn, ManyToOne} from "typeorm";
import { Armazem } from "./Armazem";
import { Cliente } from "./Cliente";
import { Etapa } from "./Etapa";
import { Rastreio } from "./Rastreio";

export enum EntregaStatus{
    Iniciada = "iniciada",
    EmAndamento = "emAndamento",
    Concluida = "concluida",
    Cancelada = "cancelada"
}

@Entity()
export class Entrega {

    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(type=>Cliente)
    cliente: Cliente;

    @ManyToOne(()=>Armazem, armazem => armazem.id)
    armazem: Armazem;

    @OneToMany(()=>Rastreio, rastreio => rastreio.entrega)
    rastreios: Rastreio[];

    @OneToMany(()=>Etapa, etapa => etapa.entrega)
    etapas: Etapa[];
    
    @Column()
    nomeDestinatario: string;

    @Column()
    enderecoDestinatario: string;

    @Column()
    status: string;

    @Column()
    produto: string;

    @CreateDateColumn({unique: false})
    dataPrevistaEntrega: Date;

    @CreateDateColumn({unique: false})
    dataEntrega: Date;   

}
