import crypto from 'node:crypto';
import { promisify } from 'node:util';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private scryptAsync = promisify(crypto.scrypt) as (
    password: string,
    salt: Buffer,
    keylen: number,
  ) => Promise<Buffer>;

  async hashPassword(senha: string): Promise<string> {
    const salt = crypto.randomBytes(16);
    const hash = await this.scryptAsync(senha, salt, 32);

    return `${salt.toString('hex')}:${hash.toString('hex')}`;
  }

  async verifyHash(senha: string, hashSalvo: string): Promise<boolean> {
    const [saltHex, hashHex] = hashSalvo.split(':');

    if (!saltHex || !hashHex) {
      return false;
    }

    const salt = Buffer.from(saltHex, 'hex');
    const hashTentativa = await this.scryptAsync(senha, salt, 32);

    return crypto.timingSafeEqual(Buffer.from(hashHex, 'hex'), hashTentativa);
  }

  async registrarUsuario(email: string, senha: string) {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      return { erro: 'E-mail já cadastrado' };
    }

    const senhaHash = await this.hashPassword(senha);

    const usuario = await this.prisma.usuario.create({
      data: {
        email,
        senhaHash,
      },
    });

    return {
      sucesso: true,
      usuario: {
        id: usuario.id,
        email: usuario.email,
      },
    };
  }

  //Gerar Token (url:https://dev.to/marcelomagario/minha-implementacao-de-autenticacao-com-jwt-e-bcrypt-1a53)

  private b64url(obj: object): string {
    return Buffer.from(JSON.stringify(obj)).toString('base64url');
  }

  private secretKey = process.env.JWT_SECRET ?? 'troque-em-produção';

  async gerarToken(idUser: string): Promise<string> {
    const header = this.b64url({ alg: 'HS256', typ: 'JWT' });
    const payload = this.b64url({ sub: idUser, exp: Date.now() + 3_600_000 });
    const assinatura = crypto
      .createHmac('sha256', this.secretKey)
      .update(`${header}.${payload}`)
      .digest('base64url');

    return `${header}.${payload}.${assinatura}`;
  }

  async verifyToken(Token: string): Promise<{ sub: string; exp: number } | null> {
    const [header, payload, assinatura] = Token.split('.');

    if (!header || !payload || !assinatura) return null;

    const assinaturaEsperada = crypto
      .createHmac('sha256', this.secretKey)
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (assinaturaEsperada !== assinatura) return null;

    const dados = JSON.parse(Buffer.from(payload, 'base64url').toString()) as {
      sub: string;
      exp: number;
    };

    if (dados.exp < Date.now()) return null;

    return dados;
  }

  async login(email: string, senha: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return null;
    }

    const senhaValida = await this.verifyHash(senha, usuario.senhaHash);

    if (!senhaValida) {
      return null;
    }

    const token = await this.gerarToken(usuario.id);

    return {
      sucesso: true,
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
      },
    };
  }
}
