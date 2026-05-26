import { TipoCliente } from './cliente-types';
import { StatusCliente } from './cliente-enum';

export class Cliente {
    id: string;
    nome: string;
    telefone: string;
    email: string;
    endereco: string;

    tipoCliente: TipoCliente;
    status: StatusCliente;

constructor(
        id: string,
        nome: string,
        telefone: string,
        email: string,
        endereco: string,
        tipoCliente: TipoCliente,
        status: StatusCliente,
    ) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.endereco = endereco;
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
        id:string,
        nome: string,
        telefone: string,
        email: string,
        endereco: string,
        status: StatusCliente,
    ) {
        super(
        id,
        nome,
        telefone,
        email,
        endereco,
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
        id: string,
        nome: string,
        telefone: string,
        email: string,
        endereco: string,
        status: StatusCliente,
    ) {
        super(
        id,
        nome,
        telefone,
        email,
        endereco,
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