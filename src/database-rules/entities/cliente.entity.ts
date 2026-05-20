import { TipoCliente } from './cliente.types';
import { StatusCliente } from './enum.client';

export class DatabaseRule {}

class Cliente {
    nome: string;
    telefone: string;
    email: string;

    tipoCliente: TipoCliente;
    status: StatusCliente;

constructor(
        nome: string,
        telefone: string,
        email: string,
        tipoCliente: TipoCliente,
        status: StatusCliente,
    ) {
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;

        this.tipoCliente = tipoCliente;
        this.status = status;
    }
    }

class ClientePJ extends Cliente {
    cnpj: string;
    razaoSocial: string;

constructor(
        cnpj: string,
        razaoSocial: string,
        nome: string,
        telefone: string,
        email: string,
        status: StatusCliente,
    ) {
        super(
        nome,
        telefone,
        email,
        'PJ',
        status,
        );

        this.cnpj = cnpj;
        this.razaoSocial = razaoSocial;
    }
    }

class ClientePF extends Cliente {
    cpf: string;

    constructor(
        cpf: string,
        nome: string,
        telefone: string,
        email: string,
        status: StatusCliente,
    ) {
        super(
        nome,
        telefone,
        email,
        'PF',
        status,
        );

        this.cpf = cpf;
    }
    }

// Descobri que interface e ruim de usar
/* interface Cliente {
    nome: string;
    telefone: string;
    email: string;
};

interface ClientePF extends Cliente {
    cpf: string;
};

interface ClientePJ extends Cliente {
    cnpj: string;
    razaoSocial: string;
};*/