import { Entity, PrimaryGeneratedColumn, Column, Timestamp, OneToOne, JoinColumn, CreateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { Entrega } from "./Entrega";

@Entity()
export class Rastreio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @CreateDateColumn()
  dataRastreio: Date;

  @Column()
  codigoRastreio: string;

  @ManyToOne(()=>Entrega, entrega=> entrega.rastreios)
  @JoinColumn()
  entrega: Entrega;

}
