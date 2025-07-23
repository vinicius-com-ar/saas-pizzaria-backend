import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsNumber, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePizzariaDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  cnpj?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  max_sabores?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  aceita_adicionais?: boolean;

  @IsOptional()
  @IsObject()
  config_personalizacao?: object;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  ativo?: boolean;
}
