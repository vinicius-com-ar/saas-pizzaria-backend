import { 
  Controller, Get, Post, Body, Param, Put, Delete, 
  UseGuards, Req 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PizzariasService } from './pizzarias.service';
import { CreatePizzariaDto } from './dto/create-pizzaria.dto';
import { UpdatePizzariaDto } from './dto/update-pizzaria.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('pizzarias')
export class PizzariasController {
  constructor(
    private readonly pizzariasService: PizzariasService
  ) {}

  @Post()
  async create(@Body() createPizzariaDto: CreatePizzariaDto, @Req() req) {
    // DEBUG: Mostra todo o req.user
    console.log('[PIZZARIA CONTROLLER] req.user:', req.user);

    // Confere se o campo é id ou userId (pode variar conforme sua strategy)
    const userId = req.user.id || req.user.userId;
    if (!userId) {
      console.error('[PIZZARIA CONTROLLER] Nenhum userId encontrado em req.user!');
      throw new Error('Usuário não autenticado.');
    }

    // DEBUG: Mostra o userId extraído
    console.log('[PIZZARIA CONTROLLER] userId:', userId);

    return this.pizzariasService.create(createPizzariaDto, userId);
  }

  @Get()
  findAll(@Req() req) {
    const userId = req.user.id || req.user.userId;
    return this.pizzariasService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const userId = req.user.id || req.user.userId;
    return this.pizzariasService.findOneByUser(+id, userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePizzariaDto: UpdatePizzariaDto, @Req() req) {
    const userId = req.user.id || req.user.userId;
    return this.pizzariasService.update(+id, updatePizzariaDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const userId = req.user.id || req.user.userId;
    return this.pizzariasService.remove(+id, userId);
  }
}
