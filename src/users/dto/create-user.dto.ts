import { IsEmail, IsNotEmpty, IsOptional, IsString, IsArray, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  senha: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  pizzariaIds?: number[];
}
