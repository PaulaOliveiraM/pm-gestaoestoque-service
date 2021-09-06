import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Entrega } from "./Entrega";

@Entity()
export class Armazem {

  constructor(id:number){
    this.id = id;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  endereco: string;

  @Column()
  bairro: string;

  @Column()
  cidade: string;

  @Column()
  estado: string;

  @Column()
  cep: string;

  @Column()
  telefone: string;

  @ManyToMany(()=>Entrega)
  @JoinTable()
  entregas: Entrega[];
}
