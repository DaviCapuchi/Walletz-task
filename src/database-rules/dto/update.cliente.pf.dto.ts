// dtos/update-pessoa-fisica.dto.ts
import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreatePFDto} from './create-profile.pf.dto';
import { IsString, IsOptional, IsEmail } from 'class-validator';

// Remove CPF (imutável) e torna tudo opcional
export class UpdatePessoaFisicaDto extends PartialType(
    OmitType(CreatePFDto, ['cpf'] as const)
) {
  // Reforça que CPF não pode ser enviado na atualização
    cpf?: never;

  // Campos que podem ser atualizados (já são opcionais pelo PartialType)
    nome?: string;
    email?: string;
    telefone?: string;
    endereco?: string;
}