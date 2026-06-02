import { Test, TestingModule } from '@nestjs/testing';
import { ClienteApiService } from './cliente-api.service';
import { ClienteController } from './cliente-api.controller';

describe('ClienteController', () => {
  let controller: ClienteController;
  const clienteApiServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getHistorico: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClienteController],
      providers: [
        {
          provide: ClienteApiService,
          useValue: clienteApiServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ClienteController>(ClienteController);
  });

  it('delegates client creation', async () => {
    clienteApiServiceMock.create.mockResolvedValue({ id: '1' });

    await expect(
      controller.create({
        id: '1',
        tipo: 'PF',
        nome: 'Joao',
        cpf: '12345678901',
        email: 'joao@email.com',
        endereco: 'Rua 1',
        telefone: '11999999999',
      }),
    ).resolves.toEqual({ id: '1' });
  });

  it('delegates list, detail, update, delete and history', async () => {
    clienteApiServiceMock.findAll.mockResolvedValue([{ id: '1' }]);
    clienteApiServiceMock.findOne.mockResolvedValue({ id: '1' });
    clienteApiServiceMock.update.mockResolvedValue({ id: '1', nome: 'Novo' });
    clienteApiServiceMock.remove.mockResolvedValue({
      removido: true,
      clienteId: '1',
    });
    clienteApiServiceMock.getHistorico.mockResolvedValue([
      { acao: 'criar', clienteId: '1', timestamp: new Date() },
    ]);

    await expect(controller.findAll()).resolves.toEqual([{ id: '1' }]);
    await expect(controller.findOne('1')).resolves.toEqual({ id: '1' });
    await expect(
      controller.update('1', { nome: 'Novo' } as never),
    ).resolves.toEqual({ id: '1', nome: 'Novo' });
    await expect(controller.remove('1')).resolves.toEqual({
      removido: true,
      clienteId: '1',
    });
    await expect(controller.getHistorico()).resolves.toHaveLength(1);
  });
});
