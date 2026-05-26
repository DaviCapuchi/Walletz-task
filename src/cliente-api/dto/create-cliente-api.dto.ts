import {IsEmail,IsIn,IsString,Length} from 'class-validator';

export class CreatePFDto {
    @IsString()
    id: string;

    @IsIn(['PF'])
    tipo: 'PF';

    @IsString()
    @Length(3, 100)
    nome: string;

    @IsString()
    @Length(11, 11)
    cpf: string;

    @IsEmail()
    email: string;

    @IsString()
    @Length(5, 200)
    endereco: string;

    @IsString()
    @Length(10, 20)
    telefone: string;
}

export class CreatePJDto {
    @IsString()
    id: string;

    @IsIn(['PJ'])
    tipo: 'PJ';

    @IsString()
    @Length(3, 150)
    razaoSocial: string;

    @IsString()
    @Length(14, 14)
    cnpj: string;

    @IsEmail()
    email: string;

    @IsString()
    @Length(5, 200)
    endereco: string;

    @IsString()
    @Length(10, 20)
    telefone: string;
}

export type CreatePessoaDto = CreatePFDto | CreatePJDto;