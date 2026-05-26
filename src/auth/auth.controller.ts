import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

  // 🔐 LOGIN
@Post('login')
    async login(@Body() dto: LoginDto) {

    // ⚠️ aqui você normalmente buscaria usuário no banco
    // como é teste, pode simular

    const senhaHash = await this.authService.hashPassword(dto.senha);

    const senhaValida = await this.authService.verifyHash(
        dto.senha,
        senhaHash,
    );

    if (!senhaValida) {
        return { erro: 'Credenciais inválidas' };
    }

    const token = await this.authService.gerarToken('user-id-exemplo');

    return {
        sucesso: true,
        token,
    };
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
