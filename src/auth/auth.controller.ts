import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

@Post('register')
    async register(@Body() dto: RegisterDto) {
    return this.authService.registrarUsuario(dto.email, dto.senha);
}

  // 🔐 LOGIN
@Post('login')
    async login(@Body() dto: LoginDto) {
    const resultado = await this.authService.login(dto.email, dto.senha);

    if (!resultado) {
        return { erro: 'Credenciais inválidas' };
    }

    return resultado;
}

  // 🔍 VALIDAR TOKEN
@Post('verify')
    async verify(@Body('token') token: string) {
    const dados = await this.authService.verifyToken(token);

    if (!dados) {
        return { valido: false };
    }

    return {
        valido: true,
        dados,
    };
}
}
