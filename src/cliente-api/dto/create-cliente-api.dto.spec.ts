import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CreatePFDto, CreatePJDto } from './create-cliente-api.dto';

describe('Cliente create DTOs', () => {
  it('validates PF payload', () => {
    const dto = plainToInstance(CreatePFDto, {
      id: 'pf-1',
      tipo: 'PF',
      nome: 'Joao Silva',
      cpf: '12345678901',
      email: 'joao@email.com',
      endereco: 'Rua A, 123',
      telefone: '11999999999',
    });

    expect(validateSync(dto)).toHaveLength(0);
  });

  it('rejects PF payload without required fields', () => {
    const dto = plainToInstance(CreatePFDto, {
      id: 'pf-1',
      tipo: 'PF',
      nome: 'Joao Silva',
      email: 'joao@email.com',
      endereco: 'Rua A, 123',
    });

    expect(validateSync(dto).length).toBeGreaterThan(0);
  });

  it('validates PJ payload', () => {
    const dto = plainToInstance(CreatePJDto, {
      id: 'pj-1',
      tipo: 'PJ',
      razaoSocial: 'Empresa LTDA',
      cnpj: '12345678000199',
      email: 'empresa@email.com',
      endereco: 'Av Central, 1000',
      telefone: '11988887777',
    });

    expect(validateSync(dto)).toHaveLength(0);
  });

  it('rejects PJ payload without required fields', () => {
    const dto = plainToInstance(CreatePJDto, {
      id: 'pj-1',
      tipo: 'PJ',
      razaoSocial: 'Empresa LTDA',
      email: 'empresa@email.com',
      endereco: 'Av Central, 1000',
    });

    expect(validateSync(dto).length).toBeGreaterThan(0);
  });
});
