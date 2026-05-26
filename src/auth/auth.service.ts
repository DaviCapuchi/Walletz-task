import crypto from 'node:crypto';
import { promisify } from 'node:util';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {

    private scryptAsync = promisify(crypto.scrypt) as (
        password: string,
        salt: Buffer,
        keylen: number
    ) => Promise<Buffer>;

    async hashPassword(senha: string): Promise <string> {
        
        const salt = crypto.randomBytes(16);
        const hash = await this.scryptAsync(senha, salt, 32)

        return `${salt.toString('hex')}: ${hash.toString('hex')}`;
    }

    async verifyHash(senha:string, hashSalvo:string): Promise <boolean> {
        const [saltHex,hasHex] = hashSalvo.split(':');
        const salt = Buffer.from(saltHex, 'hex');
        const hashTentativa =  await this.scryptAsync(senha, salt,  32);

        return crypto.timingSafeEqual(Buffer.from(hasHex, 'hex'), hashTentativa);
    }

    //Gerar Token (url:https://dev.to/marcelomagario/minha-implementacao-de-autenticacao-com-jwt-e-bcrypt-1a53)

    private b64url(obj: object): string {
        return Buffer.from(JSON.stringify(obj)).toString('base64url');
    }

    private secretKey = process.env.JWT_SECRET ?? 'troque-em-produção';

    async gerarToken(idUser: string): Promise <string> {

        const header =  this.b64url({alg: 'HS256', typ: 'JWT'})   
        const payload =  this.b64url ({sub: idUser, exp: Date.now() + 3_600_00});
        const assinatura =  crypto
            .createHmac('sha256', this.secretKey)
            .update(`${header}.${payload}`)
            .digest('base64url');

        return `${header}.${payload}.${assinatura}`;
    }

    async verifyToken(Token:string): Promise <{sub: string;  exp:number} | null> {
        const [header,payload, assinatura] = Token.split(".");

        if (!header || !payload || !assinatura) return null;

        const assinaturaEsperada = crypto
            .createHmac('sha256', this.secretKey)
            .update(`${header}.${payload}`)
            .digest('base64url');

        if (assinaturaEsperada !== assinatura) return null;

        const dados = JSON.parse(Buffer.from(payload, 'base64url').toString())
        if (dados.exp < Date.now()) return null
    
        return dados;
    }


}
