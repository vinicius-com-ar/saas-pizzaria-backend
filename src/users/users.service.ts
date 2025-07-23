import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Pizzaria } from '../pizzarias/pizzaria.entity';
import { UsuarioPizzaria } from './usuario-pizzaria.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Pizzaria)
    private pizzariasRepository: Repository<Pizzaria>,
    @InjectRepository(UsuarioPizzaria)
    private usuarioPizzariaRepository: Repository<UsuarioPizzaria>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.senha, 10);

    // Cria usuário SEM pizzarias
    const user = this.usersRepository.create({
      nome: createUserDto.nome,
      email: createUserDto.email,
      senha: hashedPassword,
      telefone: createUserDto.telefone,
      ativo: true,
    });
    await this.usersRepository.save(user);

    // Agora, se vier pizzariaIds, cria vínculos
    if (createUserDto.pizzariaIds && createUserDto.pizzariaIds.length > 0) {
      for (const pizzariaId of createUserDto.pizzariaIds) {
        const pizzaria = await this.pizzariasRepository.findOne({ where: { id: pizzariaId } });
        if (pizzaria) {
          const usuarioPizzaria = this.usuarioPizzariaRepository.create({
            user,
            pizzaria,
            cargo: 'ADMIN', // ou outro cargo, se quiser customizar
          });
          await this.usuarioPizzariaRepository.save(usuarioPizzaria);
        }
      }
    }

    return user;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (updateUserDto.senha) {
      updateUserDto.senha = await bcrypt.hash(updateUserDto.senha, 10);
    }
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  // Busca o usuário pelo email — retorna user (com senha!) para uso interno (login)
  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  // Novo método: retorna o user SEM senha + pizzarias/cargos (para frontend)
  async getUserWithPizzarias(userId: number) {
    const user = await this.findOne(userId);

    const vinculos = await this.usuarioPizzariaRepository.find({
      where: { user: { id: user.id } },
      relations: ['pizzaria'],
    });

    const pizzarias = vinculos.map(v => ({
      id: v.pizzaria.id,
      nome: v.pizzaria.nome,
      cargo: v.cargo,
    }));

    // Remove a senha do retorno
    const { senha, ...userSemSenha } = user;
    return {
      ...userSemSenha,
      pizzarias,
    };
  }

  // Método extra: lista vínculos para uso onde precisar
  async findUserPizzarias(userId: number): Promise<UsuarioPizzaria[]> {
    return this.usuarioPizzariaRepository.find({
      where: { user: { id: userId } },
      relations: ['pizzaria'],
    });
  }
}
