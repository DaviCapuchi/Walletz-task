// dtos/create-pessoa-juridica.dto.ts
import { IsString, IsNotEmpty, IsEmail, IsOptional, Length } from 'class-validator';

export class CreatePJDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    @IsNotEmpty()
    razaoSocial: string;

    @IsString()
    @IsNotEmpty()
    @Length(14, 14)
    cnpj: string;


    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    telefone: string;

    @IsString()
    @IsOptional()
    endereco: string;   

}