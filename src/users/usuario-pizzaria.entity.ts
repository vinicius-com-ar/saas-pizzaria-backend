
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany,OneToMany, ManyToOne,JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Pizzaria } from '../pizzarias/pizzaria.entity';

@Entity('usuarios_pizzarias')
export class UsuarioPizzaria {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.usuariosPizzarias, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Pizzaria, pizzaria => pizzaria.usuariosPizzarias, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pizzaria_id' })
  pizzaria: Pizzaria;

  @Column({ type: 'varchar', length: 30, nullable: false })
  cargo: string;
}


