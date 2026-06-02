import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const prismaMock = {
    usuario: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('hashes and validates password correctly', async () => {
    const hash = await service.hashPassword('senha-secreta');

    await expect(service.verifyHash('senha-secreta', hash)).resolves.toBe(true);
    await expect(service.verifyHash('senha-errada', hash)).resolves.toBe(false);
  });

  it('registers a new user when email is available', async () => {
    prismaMock.usuario.findUnique.mockResolvedValue(null);
    prismaMock.usuario.create.mockImplementation(async ({ data }) => ({
      id: 'user-1',
      email: data.email,
      senhaHash: data.senhaHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await service.registrarUsuario('teste@email.com', '123456');

    expect(result).toEqual({
      sucesso: true,
      usuario: {
        id: 'user-1',
        email: 'teste@email.com',
      },
    });
    expect(prismaMock.usuario.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'teste@email.com',
          senhaHash: expect.any(String),
        }),
      }),
    );
  });

  it('returns an error when trying to register an existing email', async () => {
    prismaMock.usuario.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'teste@email.com',
      senhaHash: 'hash',
    });

    await expect(
      service.registrarUsuario('teste@email.com', '123456'),
    ).resolves.toEqual({ erro: 'E-mail já cadastrado' });
  });

  it('logs in with valid credentials', async () => {
    const senhaHash = await service.hashPassword('123456');

    prismaMock.usuario.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'teste@email.com',
      senhaHash,
    });

    const result = await service.login('teste@email.com', '123456');

    expect(result).toMatchObject({
      sucesso: true,
      usuario: {
        id: 'user-1',
        email: 'teste@email.com',
      },
    });
    expect(result?.token).toEqual(expect.any(String));
  });

  it('returns null on invalid login credentials', async () => {
    const senhaHash = await service.hashPassword('123456');

    prismaMock.usuario.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'teste@email.com',
      senhaHash,
    });

    await expect(service.login('teste@email.com', 'senha-errada')).resolves.toBe(
      null,
    );
  });

  it('generates and validates tokens', async () => {
    const token = await service.gerarToken('user-1');

    await expect(service.verifyToken(token)).resolves.toMatchObject({
      sub: 'user-1',
    });
    await expect(service.verifyToken('token-invalido')).resolves.toBeNull();
  });
});
