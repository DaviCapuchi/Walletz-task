import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authServiceMock = {
    registrarUsuario: jest.fn(),
    login: jest.fn(),
    verifyToken: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('registers a user through the service', async () => {
    authServiceMock.registrarUsuario.mockResolvedValue({
      sucesso: true,
      usuario: { id: 'user-1', email: 'teste@email.com' },
    });

    await expect(
      controller.register({ email: 'teste@email.com', senha: '123456' }),
    ).resolves.toEqual({
      sucesso: true,
      usuario: { id: 'user-1', email: 'teste@email.com' },
    });
  });

  it('returns invalid credentials on failed login', async () => {
    authServiceMock.login.mockResolvedValue(null);

    await expect(
      controller.login({ email: 'teste@email.com', senha: 'errada' }),
    ).resolves.toEqual({ erro: 'Credenciais inválidas' });
  });

  it('returns token on successful login', async () => {
    authServiceMock.login.mockResolvedValue({
      sucesso: true,
      token: 'token.jwt',
      usuario: { id: 'user-1', email: 'teste@email.com' },
    });

    await expect(
      controller.login({ email: 'teste@email.com', senha: '123456' }),
    ).resolves.toEqual({
      sucesso: true,
      token: 'token.jwt',
      usuario: { id: 'user-1', email: 'teste@email.com' },
    });
  });

  it('validates tokens through the service', async () => {
    authServiceMock.verifyToken.mockResolvedValue({
      sub: 'user-1',
      exp: Date.now() + 1000,
    });

    await expect(controller.verify('token.jwt')).resolves.toEqual({
      valido: true,
      dados: {
        sub: 'user-1',
        exp: expect.any(Number),
      },
    });
  });
});
