import { IsString, isString } from "class-validator";

export class LoginDto {
    @IsString()
    email: string;

    @isString()
    senha: string;
}