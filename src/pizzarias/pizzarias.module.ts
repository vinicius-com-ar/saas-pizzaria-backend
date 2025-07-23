import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PizzariasService } from './pizzarias.service';
import { PizzariasController } from './pizzarias.controller';
import { Pizzaria } from './pizzaria.entity';
import { UsuarioPizzaria } from '../users/usuario-pizzaria.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pizzaria, UsuarioPizzaria]), // <---- IMPORTANTE!
  ],
  controllers: [PizzariasController],
  providers: [PizzariasService],
  exports: [TypeOrmModule],
})
export class PizzariasModule {}
