import { Injectable } from '@nestjs/common';
import { Cliente } from './entities/cliente-api.entity';


@Injectable()
export class ClientesRepository {
    private clientes: Cliente[] = [];
    private indexEmail =  new Map< string, Cliente>();
    private emails = new Set <string>();

async create(cliente: Cliente): Promise<Cliente> {
    if (this.emails.has(cliente.email)){
        throw new Error(`Email ${cliente.email} ja esta em uso` );
    }
    this.clientes.push(cliente);
    this.emails.add(cliente.email);     //Se eu estiver certo aqui ja 
    this.indexEmail.set(cliente.email, cliente); // esta verificando se existe um email ou não
    return cliente;
}

async findAll(
    nome?: string,
    page: number = 1,
    limit: number = 10,
): Promise<Cliente[]> {

    let resultado = this.clientes;

    // 🔎 filtro por nome
    if (nome) {
        resultado = resultado.filter(c =>
        c.nome.toLowerCase().includes(nome.toLowerCase()),
    );
}

    // 📄 paginação
    const inicio = (page - 1) * limit;
    const fim = inicio + limit;

    return resultado.slice(inicio, fim);
}

async findByEmail(email:string): Promise<Cliente | undefined> {
    return this.indexEmail.get(email) ?? undefined;
}

async update(id:string, dados: Partial<Cliente>): Promise<Cliente | null> {
    const index =  this.clientes.findIndex(c => (dados.id ===  dados.id));

    if (index === -1) return null;

    const oldEmail = this.clientes[index];
    const newEmail = dados.email && dados.email !== oldEmail.email;

    if (newEmail){
        if (this.emails.has(dados.email!)) {
            throw new Error(`Email ${dados.email} já está em uso`);
        }
    }

    this.emails.delete(oldEmail.email);
    this.indexEmail.delete(oldEmail.email);

    this.emails.add(dados.email!);
    this.indexEmail.set(dados.email!, {...oldEmail, ...dados})


    this.clientes[index] = {
        ...this.clientes[index],
        ...dados,
    };

    return this.clientes[index];
}

async delete(id: string): Promise<boolean> {
    const index = this.clientes.findIndex(c => (id === id));

    if (index === -1) return false;

    const deleteCliente = this.clientes[index];
    
    this.emails.delete(deleteCliente.email);
    this.indexEmail.delete(deleteCliente.email);
    this.clientes.splice(index, 1);
    
    return true;
}
 //Que bagulho complicado de entender,a forma de escrever e muito confuso para min

// Set
}

