import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PizzariasModule } from './pizzarias/pizzarias.module';
import { ProdutosModule } from './produtos/produtos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { ClientesModule } from './clientes/clientes.module';
import { PermissoesModule } from './permissoes/permissoes.module';

// IMPORTANTE: só o import aqui, sem incluir no array de módulos!
import { UsuarioPizzaria } from './users/usuario-pizzaria.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +(process.env.DATABASE_PORT || 5432),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true, // <-- mantém true
      synchronize: true,
      logging: true
      // Se quisesse explicitar:
      // entities: [User, Pizzaria, UsuarioPizzaria, ...outrasEntities]
    }),
    AuthModule,
    UsersModule,
    PizzariasModule,
    ProdutosModule,
    CategoriasModule,
    PedidosModule,
    ClientesModule,
    PermissoesModule,
  ],
})
export class AppModule {}
