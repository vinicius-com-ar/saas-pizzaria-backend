import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'segredo-pizza-top',
    });
  }

  async validate(payload: any) {
    // Aqui você pode buscar mais dados do user se quiser, mas o mínimo é retornar algo para req.user
    // Exemplo: incluir mais campos vindos do payload
    return {
      id: payload.sub,
      email: payload.email,
      nome: payload.nome,
      // ...outros campos que você colocou no payload do token
    };
  }
}
