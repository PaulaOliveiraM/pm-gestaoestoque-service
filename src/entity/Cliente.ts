import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm";
import { Entrega } from "./Entrega";

@Entity()
export class Cliente {

  constructor(id:number){
    this.id = id;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 14})
  cnpj:string;

  @Column({length: 12})
  ie:string;

  @Column()
  nome: string;

  @Column()
  endereco: string;

  @Column()
  numero: number;

  @Column()
  complemento: string;

  @Column()
  bairro: string;

  @Column()
  cidade: string;

  @Column()
  estado: string;

  @Column()
  cep: string;

  @OneToMany(()=>Entrega, entrega => entrega.cliente)
  @JoinColumn()
  entregas?: Entrega[];
}
