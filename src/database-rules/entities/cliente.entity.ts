export class DatabaseRule {}

// Fiquei uns 40 minutos so nessa merda

class Cliente {
    nome: string;
    telefone: string;
    email: string;

    constructor(nome:string, telefone:string, email:string) {
        this.nome  = nome;
        this.email = email;
        this.telefone = telefone;
    }
}

class ClientePJ extends Cliente {
    cnpj: string;
    razaoSocial: string;

    constructor(cnpj: string, razaoSocial: string, nome:string, telefone:string, email:string){
        super(nome, email, telefone);
        this.cnpj = cnpj;
        this.razaoSocial = razaoSocial;
    }
}

class ClientePF extends Cliente {
    cpf: string;

    constructor(cpf: string,nome:string, telefone:string, email:string){
        super(nome, email, telefone);

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