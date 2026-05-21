// dtos/update-pessoa-juridica.dto.ts
import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreatePJDto } from './create.profile.pj.dto';

// Remove CNPJ (imutável) e torna tudo opcional
export class UpdatePessoaJuridicaDto extends PartialType(
    OmitType(CreatePJDto, ['cnpj'] as const)
) {
  // Reforça que CNPJ não pode ser enviado na atualização
    cnpj?: never;

  // Campos que podem ser atualizados
    razaoSocial?: string;
    nomeFantasia?: string;
    email?: string;
    telefone?: string;
    endereco?: string;
}