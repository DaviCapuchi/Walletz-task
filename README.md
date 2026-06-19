# Api Walletz

API backend para autenticação e gerenciamento de clientes, construída com NestJS, Prisma e PostgreSQL.

O projeto foi pensado para servir como base de estudo e prática de conceitos importantes de backend, como organização modular, validação de dados, persistência em banco, autenticação e testes.

## O que este projeto faz

- Login de usuário com geração e validação de token
- Cadastro de usuários para acesso à API
- Cadastro de clientes pessoa física e pessoa jurídica
- Listagem, edição e exclusão de clientes
- Histórico das últimas ações executadas
- Auditoria em memória das operações de cliente

## Tecnologias usadas

- [NestJS](https://nestjs.com/) para estruturação da API
- [TypeScript](https://www.typescriptlang.org/) para tipagem estática
- [Prisma](https://www.prisma.io/) como ORM
- [PostgreSQL](https://www.postgresql.org/) como banco de dados
- [Bun](https://bun.sh/) como runtime e gerenciador de pacotes
- `class-validator` e `class-transformer` para validação de DTOs
- `supertest` e `jest` para testes

## Fundamentos aplicados

### 1. Arquitetura modular
O sistema é dividido em módulos, o que facilita manutenção e evolução.

- `AuthModule` cuida de autenticação
- `ClienteApiModule` cuida do CRUD de clientes
- `PrismaModule` centraliza o acesso ao banco

### 2. Separação de responsabilidades
Cada camada tem um papel claro:

- **Controller**: recebe as requisições HTTP
- **Service**: concentra as regras de negócio
- **DTO**: define o formato de entrada e validação
- **PrismaService**: conversa com o banco

### 3. REST
A API segue uma estrutura REST simples com rotas para:

- `POST /auth/register`
- `POST /auth/login`
- `POST /clientes`
- `GET /clientes`
- `GET /clientes/historico`
- `GET /clientes/:id`
- `PATCH /clientes/:id`
- `DELETE /clientes/:id`

### 4. Validação de entrada
Os DTOs protegem a API contra dados inválidos, garantindo:

- e-mail válido no login e cadastro
- campos obrigatórios no cadastro de clientes
- validações diferentes para PF e PJ

### 5. Persistência de dados
Os dados principais ficam salvos no PostgreSQL usando Prisma:

- usuários de acesso
- clientes cadastrados

### 6. Segurança básica
O projeto usa:

- hash de senha antes de salvar no banco
- comparação segura de senha no login
- geração e validação de token

### 7. Testes
Há testes unitários cobrindo:

- autenticação
- validação de DTOs
- cadastro, listagem, edição e exclusão de clientes
- histórico de auditoria

## Estrutura principal

- `src/auth`: autenticação e login
- `src/cliente-api`: cadastro e gestão de clientes
- `src/prisma`: integração com o banco de dados
- `test`: testes e2e

## Como executar

### 1. Instalar dependências

```bash
bun install
```

### 2. Configurar o banco

No arquivo `.env`, ajuste a conexão:

```env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/nestdb"
```

### 3. Criar as tabelas no banco

```bash
bunx prisma db push
```

### 4. Gerar o Prisma Client

```bash
bunx prisma generate
```

### 5. Subir a aplicação

```bash
bunx nest start
```

## Testes

```bash
bunx jest
```

Ou, se preferir usar os scripts do projeto:

```bash
bun run test
```

## Exemplo de uso

### Cadastro de usuário

`POST /auth/register`

```json
{
  "email": "teste@email.com",
  "senha": "123456"
}
```

### Login

`POST /auth/login`

```json
{
  "email": "teste@email.com",
  "senha": "123456"
}
```

### Cadastro de cliente PF

`POST /clientes`

```json
{
  "id": "cli-1",
  "tipo": "PF",
  "nome": "Joao Silva",
  "cpf": "12345678901",
  "email": "joao@email.com",
  "endereco": "Rua A, 123",
  "telefone": "11999999999"
}
```

### Cadastro de cliente PJ

`POST /clientes`

```json
{
  "id": "cli-2",
  "tipo": "PJ",
  "razaoSocial": "Empresa LTDA",
  "cnpj": "12345678000199",
  "email": "empresa@email.com",
  "endereco": "Av Central, 1000",
  "telefone": "11988887777"
}
```

## Observações

- O histórico de ações de cliente hoje está em memória, então ele é perdido quando a aplicação reinicia.
- O login usa a tabela `Usuario` do banco para verificar e-mail e senha.
- O cadastro de cliente usa a tabela `Cliente` no PostgreSQL.

## Objetivo didático

Este projeto é útil para praticar:

- CRUD com banco de dados
- autenticação básica
- organização em módulos
- validação de entrada
- testes automatizados
- integração com ORM e PostgreSQL

