import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UsuarioPizzaria } from '../users/usuario-pizzaria.entity';

@Entity('pizzarias')
export class Pizzaria {
  @PrimaryGeneratedColumn()
  id: number;


  @Column()
  nome: string;

  @Column({ nullable: true })
  cnpj: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  telefone: string;

  @Column({ nullable: true })
  endereco: string;

  @Column({ default: 2 })
  max_sabores: number;

  @Column({ default: true })
  aceita_adicionais: boolean;

  @Column({ type: 'jsonb', nullable: true })
  config_personalizacao: object;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_criacao: Date;

  @Column({ default: true })
  ativo: boolean;


  @OneToMany(() => UsuarioPizzaria, up => up.pizzaria)
  usuariosPizzarias: UsuarioPizzaria[];
}