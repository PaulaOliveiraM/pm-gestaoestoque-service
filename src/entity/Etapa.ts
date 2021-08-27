import { Entity, PrimaryGeneratedColumn, Column, Timestamp, OneToOne, JoinColumn, CreateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { Entrega } from "./Entrega";
export enum EtapasEntrega{
    EntregaIniciada  = 'entregaIniciada',
    EntregaFinalizada = 'entregaFinalizada',
    EntregaACaminho = 'entregaACaminho',
    EntregaDevolvida = 'entregaDevolvida',
    EntregaExtraviada = 'entregaExtraviada'
};

@Entity()
export class Etapa {    

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  etapa: EtapasEntrega;

  @Column()
  usuarioResponsavel: string;

  @CreateDateColumn()
  data: Date;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @ManyToOne(() => Entrega, entrega => entrega.etapas)
  @JoinColumn()
  entrega: Entrega;

  @Column({default:null})
  observacoes?: string;
}
