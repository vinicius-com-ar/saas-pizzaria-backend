import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsuarioPizzaria } from './usuario-pizzaria.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Pizzaria } from '../pizzarias/pizzaria.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Pizzaria, UsuarioPizzaria]), // <-- aqui!
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // (opcional, se outros módulos usarem)
})
export class UsersModule {}
