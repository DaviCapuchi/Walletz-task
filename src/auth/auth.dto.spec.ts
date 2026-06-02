import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { LoginDto, RegisterDto } from './auth.dto';

describe('Auth DTOs', () => {
  it('validates register payload', () => {
    const dto = plainToInstance(RegisterDto, {
      email: 'teste@email.com',
      senha: '123456',
    });

    expect(validateSync(dto)).toHaveLength(0);
  });

  it('rejects invalid register payload', () => {
    const dto = plainToInstance(RegisterDto, {
      email: 'nao-e-email',
      senha: '123',
    });

    expect(validateSync(dto).length).toBeGreaterThan(0);
  });

  it('validates login payload', () => {
    const dto = plainToInstance(LoginDto, {
      email: 'teste@email.com',
      senha: '123456',
    });

    expect(validateSync(dto)).toHaveLength(0);
  });
});
