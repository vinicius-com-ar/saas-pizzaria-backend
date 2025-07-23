import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pizzaria } from './pizzaria.entity';
import { CreatePizzariaDto } from './dto/create-pizzaria.dto';
import { UpdatePizzariaDto } from './dto/update-pizzaria.dto';
import { UsuarioPizzaria } from '../users/usuario-pizzaria.entity';

@Injectable()
export class PizzariasService {
  constructor(
    @InjectRepository(Pizzaria)
    private pizzariasRepository: Repository<Pizzaria>,
    @InjectRepository(UsuarioPizzaria)
    private usuarioPizzariaRepository: Repository<UsuarioPizzaria>,
  ) {}

  // Criação + vínculo ao usuário autenticado
  async create(createPizzariaDto: CreatePizzariaDto, userId: number): Promise<Pizzaria> {
    try {
      // Cria pizzaria normalmente
      const pizzaria = this.pizzariasRepository.create(createPizzariaDto);
      const saved = await this.pizzariasRepository.save(pizzaria);

      console.log('[PIZZARIA] Criada com ID:', saved.id);

      // Vincula usuário como ADMIN da pizzaria
      const usuarioPizzaria = this.usuarioPizzariaRepository.create({
        user: { id: userId },
        pizzaria: { id: saved.id },
        cargo: 'ADMIN'
      });

      console.log('[VÍNCULO] Vinculando usuário:', userId, '-> pizzaria:', saved.id);

      await this.usuarioPizzariaRepository.save(usuarioPizzaria);

      console.log('[VÍNCULO] Usuário', userId, 'vinculado como ADMIN à pizzaria', saved.id);

      return saved;
    } catch (error) {
      console.error('[ERRO AO CRIAR PIZZARIA]', error);
      throw new InternalServerErrorException('Erro ao criar pizzaria/vínculo');
    }
  }

  // Lista pizzarias apenas do usuário autenticado
  async findAllByUser(userId: number): Promise<Pizzaria[]> {
    const vinculos = await this.usuarioPizzariaRepository.find({
      where: { user: { id: userId } },
      relations: ['pizzaria'],
    });
    return vinculos.map(v => v.pizzaria);
  }

  // Busca uma pizzaria só se o usuário for membro dela
  async findOneByUser(id: number, userId: number): Promise<Pizzaria> {
    const vinculo = await this.usuarioPizzariaRepository.findOne({
      where: { user: { id: userId }, pizzaria: { id } },
      relations: ['pizzaria'],
    });
    if (!vinculo) throw new ForbiddenException('Acesso negado à pizzaria');
    return vinculo.pizzaria;
  }

  // Atualiza apenas se o usuário for membro (ideal: verificar se é ADMIN)
  async update(id: number, updatePizzariaDto: UpdatePizzariaDto, userId: number): Promise<Pizzaria> {
    const pizzaria = await this.findOneByUser(id, userId);
    Object.assign(pizzaria, updatePizzariaDto);
    return this.pizzariasRepository.save(pizzaria);
  }

  // Remove apenas se for membro (ideal: ADMIN)
  async remove(id: number, userId: number): Promise<void> {
    const pizzaria = await this.findOneByUser(id, userId);
    await this.pizzariasRepository.delete(pizzaria.id);
  }

  // (Opcional) Listar todas (apenas para super admin)
  findAll(): Promise<Pizzaria[]> {
    return this.pizzariasRepository.find({ relations: ['usuariosPizzarias'] });
  }

  // (Opcional) Buscar por id (apenas para super admin)
  async findOne(id: number): Promise<Pizzaria> {
    const pizzaria = await this.pizzariasRepository.findOne({ where: { id }, relations: ['usuariosPizzarias'] });
    if (!pizzaria) throw new NotFoundException('Pizzaria não encontrada');
    return pizzaria;
  }
}
