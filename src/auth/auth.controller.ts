import { Controller, Post, Body, UnauthorizedException, Get, UseGuards, Request, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Login attempt for: ${loginDto.email}`);
    const user = await this.authService.validateUser(loginDto.email, loginDto.senha);
    if (!user) {
      this.logger.warn(`Login failed for: ${loginDto.email}`);
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }
    this.logger.log(`Login success for: ${loginDto.email}`);
    const result = await this.authService.login(user);
    this.logger.debug(`Login payload: ${JSON.stringify(result)}`);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    this.logger.log(`Acessou /auth/me, req.user: ${JSON.stringify(req.user)}`);

    // Busca o usuário completo, já incluindo as pizzarias vinculadas
    const user = await this.authService.getUserWithPizzarias(req.user.id);

    // O método já retorna { id, nome, email, pizzarias }
    // Não precisa mapear de novo
    const userToReturn = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      pizzarias: user.pizzarias || [],
    };

    this.logger.debug(`Retornando user completo: ${JSON.stringify(userToReturn)}`);
    return userToReturn;
  }
}
