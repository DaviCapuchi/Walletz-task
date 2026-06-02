import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePFDto, CreatePJDto } from './dto/create-cliente-api.dto';
import { ClienteApiService } from './cliente-api.service';

type ClienteRecord = {
  id: string;
  tipo: 'PF' | 'PJ';
  nome: string;
  cpf?: string | null;
  cnpj?: string | null;
  razaoSocial?: string | null;
  email: string;
  endereco: string;
  telefone: string;
  createdAt: Date;
  updatedAt: Date;
};

function createUniqueError() {
  const error = new Error('Unique constraint');
  (error as Error & { code?: string }).code = 'P2002';
  return error;
}

function createPrismaMock() {
  const store = new Map<string, ClienteRecord>();
  let sequence = 0;
  const baseTime = Date.parse('2026-01-01T00:00:00.000Z');

  const cliente = {
    create: jest.fn(async ({ data }: { data: Partial<ClienteRecord> }) => {
      if (
        [...store.values()].some(
          (item) => item.email === data.email || item.id === data.id,
        )
      ) {
        throw createUniqueError();
      }

      const timestamp = new Date(baseTime + sequence++);
      const record: ClienteRecord = {
        id: data.id as string,
        tipo: data.tipo as 'PF' | 'PJ',
        nome: data.nome as string,
        cpf: (data.cpf as string | null | undefined) ?? null,
        cnpj: (data.cnpj as string | null | undefined) ?? null,
        razaoSocial:
          (data.razaoSocial as string | null | undefined) ?? null,
        email: data.email as string,
        endereco: data.endereco as string,
        telefone: data.telefone as string,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      store.set(record.id, record);
      return record;
    }),
    findMany: jest.fn(async () =>
      [...store.values()].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      ),
    ),
    findUnique: jest.fn(async ({ where: { id } }: { where: { id: string } }) =>
      store.get(id) ?? null,
    ),
    update: jest.fn(
      async ({
        where: { id },
        data,
      }: {
        where: { id: string };
        data: Partial<ClienteRecord>;
      }) => {
        const current = store.get(id);

        if (!current) {
          throw new Error('Cliente não encontrado');
        }

        const updated: ClienteRecord = {
          ...current,
          ...data,
          updatedAt: new Date(baseTime + sequence++),
        };

        store.set(id, updated);
        return updated;
      },
    ),
    delete: jest.fn(async ({ where: { id } }: { where: { id: string } }) => {
      const current = store.get(id);

      if (!current) {
        throw new Error('Cliente não encontrado');
      }

      store.delete(id);
      return current;
    }),
  };

  return {
    store,
    cliente,
  };
}

describe('ClienteApiService', () => {
  let service: ClienteApiService;
  let prismaMock: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    jest.clearAllMocks();
    prismaMock = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClienteApiService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ClienteApiService>(ClienteApiService);
  });

  it('creates PF clients and enqueues audit history', async () => {
    const dto: CreatePFDto = {
      id: 'pf-1',
      tipo: 'PF',
      nome: 'Joao Silva',
      cpf: '12345678901',
      email: 'joao@email.com',
      endereco: 'Rua A, 123',
      telefone: '11999999999',
    };

    const created = await service.create(dto);

    expect(created).toMatchObject({
      id: 'pf-1',
      tipo: 'PF',
      nome: 'Joao Silva',
      cpf: '12345678901',
      email: 'joao@email.com',
    });
    expect(prismaMock.cliente.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          nome: 'Joao Silva',
        }),
      }),
    );
    await expect(service.getHistorico()).resolves.toHaveLength(1);
  });

  it('creates PJ clients mapping razaoSocial to nome', async () => {
    const dto: CreatePJDto = {
      id: 'pj-1',
      tipo: 'PJ',
      razaoSocial: 'Empresa LTDA',
      cnpj: '12345678000199',
      email: 'empresa@email.com',
      endereco: 'Av Central, 1000',
      telefone: '11988887777',
    };

    const created = await service.create(dto);

    expect(created).toMatchObject({
      id: 'pj-1',
      tipo: 'PJ',
      nome: 'Empresa LTDA',
      razaoSocial: 'Empresa LTDA',
      cnpj: '12345678000199',
    });
    expect(prismaMock.cliente.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          nome: 'Empresa LTDA',
        }),
      }),
    );
  });

  it('lists clients ordered by most recent first', async () => {
    await service.create({
      id: '1',
      tipo: 'PF',
      nome: 'Primeiro',
      cpf: '12345678901',
      email: 'primeiro@email.com',
      endereco: 'Rua 1',
      telefone: '11999999999',
    });
    await service.create({
      id: '2',
      tipo: 'PF',
      nome: 'Segundo',
      cpf: '12345678902',
      email: 'segundo@email.com',
      endereco: 'Rua 2',
      telefone: '11999999998',
    });

    const clientes = await service.findAll();

    expect(clientes.map((cliente) => cliente.id)).toEqual(['2', '1']);
  });

  it('finds a client by id and throws when missing', async () => {
    await service.create({
      id: '1',
      tipo: 'PF',
      nome: 'Joao',
      cpf: '12345678901',
      email: 'joao@email.com',
      endereco: 'Rua 1',
      telefone: '11999999999',
    });

    await expect(service.findOne('1')).resolves.toMatchObject({ id: '1' });
    await expect(service.findOne('404')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates a client and records audit history', async () => {
    await service.create({
      id: '1',
      tipo: 'PF',
      nome: 'Joao',
      cpf: '12345678901',
      email: 'joao@email.com',
      endereco: 'Rua 1',
      telefone: '11999999999',
    });

    const updated = await service.update('1', {
      nome: 'Joao Atualizado',
      email: 'joao.atualizado@email.com',
    });

    expect(updated).toMatchObject({
      id: '1',
      nome: 'Joao Atualizado',
      email: 'joao.atualizado@email.com',
    });

    const historico = await service.getHistorico();
    expect(historico.map((item) => item.acao)).toEqual(['editar', 'criar']);
  });

  it('removes a client and records audit history', async () => {
    await service.create({
      id: '1',
      tipo: 'PF',
      nome: 'Joao',
      cpf: '12345678901',
      email: 'joao@email.com',
      endereco: 'Rua 1',
      telefone: '11999999999',
    });

    await expect(service.remove('1')).resolves.toEqual({
      removido: true,
      clienteId: '1',
    });

    await expect(service.findOne('1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    const historico = await service.getHistorico();
    expect(historico.map((item) => item.acao)).toEqual(['excluir', 'criar']);
  });

  it('keeps only the last 10 audit events', async () => {
    for (let index = 1; index <= 11; index += 1) {
      await service.create({
        id: String(index),
        tipo: 'PF',
        nome: `Cliente ${index}`,
        cpf: `1234567890${index % 10}`,
        email: `cliente${index}@email.com`,
        endereco: `Rua ${index}`,
        telefone: '11999999999',
      });
    }

    const historico = await service.getHistorico();

    expect(historico).toHaveLength(10);
    expect(historico[0].clienteId).toBe('11');
    expect(historico[9].clienteId).toBe('2');
  });

  it('converts unique constraint errors into ConflictException', async () => {
    await service.create({
      id: '1',
      tipo: 'PF',
      nome: 'Joao',
      cpf: '12345678901',
      email: 'joao@email.com',
      endereco: 'Rua 1',
      telefone: '11999999999',
    });

    await expect(
      service.create({
        id: '2',
        tipo: 'PF',
        nome: 'Joao 2',
        cpf: '12345678902',
        email: 'joao@email.com',
        endereco: 'Rua 2',
        telefone: '11999999998',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
