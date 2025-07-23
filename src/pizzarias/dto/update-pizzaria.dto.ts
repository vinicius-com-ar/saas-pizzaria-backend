import { PartialType } from '@nestjs/mapped-types';
import { CreatePizzariaDto } from './create-pizzaria.dto';

export class UpdatePizzariaDto extends PartialType(CreatePizzariaDto) {}
