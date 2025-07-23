import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, senha: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(senha, user.senha)) {
      return user; // Aqui ainda vem a senha
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };

    // Busca o user SEM senha + pizzarias/cargos
    const userData = await this.usersService.getUserWithPizzarias(user.id);

    return {
      access_token: this.jwtService.sign(payload),
      user: userData,
    };
  }

  // Método chamado pelo controller /auth/me
  async getUserWithPizzarias(userId: number) {
    // Busca pelo UsersService para garantir que relations estão carregadas
    return this.usersService.getUserWithPizzarias(userId);
  }
}