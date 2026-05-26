import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cliente as ClienteModel, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePessoaDto } from './dto/create-cliente-api.dto';
import { UpdatePessoaDto } from './dto/update-cliente-api.dto';

type AcaoAuditoria = 'criar' | 'editar' | 'excluir';

export interface EventoAuditoria {
  acao: AcaoAuditoria;
  clienteId: string;
  timestamp: Date;
}

export interface RemocaoResultado {
  removido: true;
  clienteId: string;
}

@Injectable()
export class ClienteApiService {
  private readonly filaAuditoria: EventoAuditoria[] = [];
  private readonly historico: EventoAuditoria[] = [];

  constructor(private readonly prisma: PrismaService) {}

  async create(createClienteApiDto: CreatePessoaDto): Promise<ClienteModel> {
    try {
      const cliente = await this.prisma.cliente.create({
        data: this.montarDadosCriacao(createClienteApiDto),
      });

      this.enfileirarAuditoria('criar', cliente.id);
      return cliente;
    } catch (error) {
      this.tratarErroPrisma(error, 'criação');
    }
  }

  async findAll(): Promise<ClienteModel[]> {
    return this.prisma.cliente.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<ClienteModel> {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente ${id} não encontrado`);
    }

    return cliente;
  }

  async update(
    id: string,
    updateClienteApiDto: UpdatePessoaDto,
  ): Promise<ClienteModel> {
    await this.findOne(id);

    try {
      const cliente = await this.prisma.cliente.update({
        where: { id },
        data: this.montarDadosAtualizacao(updateClienteApiDto),
      });

      this.enfileirarAuditoria('editar', id);
      return cliente;
    } catch (error) {
      this.tratarErroPrisma(error, 'edição');
    }
  }

  async remove(id: string): Promise<RemocaoResultado> {
    await this.findOne(id);

    await this.prisma.cliente.delete({
      where: { id },
    });

    this.enfileirarAuditoria('excluir', id);
    return { removido: true, clienteId: id };
  }

  async getHistorico(): Promise<EventoAuditoria[]> {
    return [...this.historico].reverse();
  }

  private montarDadosCriacao(createClienteApiDto: CreatePessoaDto): Prisma.ClienteCreateInput {
    return {
      ...createClienteApiDto,
      nome:
        createClienteApiDto.tipo === 'PJ'
          ? createClienteApiDto.razaoSocial
          : createClienteApiDto.nome,
    };
  }

  private montarDadosAtualizacao(
    updateClienteApiDto: UpdatePessoaDto,
  ): Prisma.ClienteUpdateInput {
    return {
      ...updateClienteApiDto,
    };
  }

  private enfileirarAuditoria(acao: AcaoAuditoria, clienteId: string): void {
    this.filaAuditoria.push({
      acao,
      clienteId,
      timestamp: new Date(),
    });

    this.processarFilaAuditoria();
  }

  private processarFilaAuditoria(): void {
    while (this.filaAuditoria.length > 0) {
      const evento = this.filaAuditoria.shift();

      if (!evento) {
        continue;
      }

      this.historico.push(evento);

      if (this.historico.length > 10) {
        this.historico.shift();
      }
    }
  }

  private tratarErroPrisma(error: unknown, operacao: string): never {
    if (this.isUniqueConstraintError(error)) {
      throw new ConflictException(
        `Não foi possível concluir a ${operacao} porque um campo único já está em uso`,
      );
    }

    throw error;
  }

  private isUniqueConstraintError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'P2002'
    );
  }
}
