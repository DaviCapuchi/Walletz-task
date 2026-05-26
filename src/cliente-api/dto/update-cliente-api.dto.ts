import { CreatePFDto,CreatePJDto } from './create-cliente-api.dto';
import { PartialType, OmitType } from '@nestjs/mapped-types';


export class UpdatePFDto extends PartialType(
    OmitType(CreatePFDto, ['cpf', 'tipo'] as const),
) {}

export class UpdatePJDto extends PartialType(
    OmitType(CreatePJDto, ['cnpj', 'tipo'] as const),
) {}

export type UpdatePessoaDto = UpdatePFDto | UpdatePJDto;
