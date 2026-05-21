// dtos/create-pessoa-fisica.dto.ts
import { IsString, IsNotEmpty, IsEmail, IsOptional, Length } from 'class-validator';

export class CreatePFDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    @IsNotEmpty()
    @Length(11, 11)
    cpf: string;

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