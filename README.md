# 💬 Messages Node.js

API backend para sistema de mensagens em tempo real com autenticação GitHub OAuth e WebSocket.

## 📋 Sobre o Projeto

Sistema de mensagens desenvolvido com Node.js, Express e Socket.IO que permite:

- 🔐 Autenticação via GitHub OAuth
- 💬 Envio de mensagens em tempo real
- 👥 Sistema de perfil de usuários
- 📡 Comunicação WebSocket para atualizações instantâneas
- 🗄️ Banco de dados PostgreSQL com Prisma ORM

## 🛠️ Tecnologias

- **Node.js** com **TypeScript**
- **Express.js** - Framework web
- **Socket.IO** - Comunicação em tempo real
- **Prisma** - ORM para PostgreSQL
- **JWT** - Autenticação e autorização
- **Axios** - Cliente HTTP para integração GitHub
- **Docker** - Containerização do banco de dados

## 📦 Pré-requisitos

- Node.js (v16 ou superior)
- Docker e Docker Compose
- Conta GitHub (para OAuth)
- npm ou yarn

## 🚀 Configuração do Ambiente de Desenvolvimento

### 1. Clone o repositório

```bash
git clone https://github.com/kevinmcruzp/messages-nodejs.git
cd messages-nodejs
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e configure suas credenciais:

```bash
cp .env.Example .env
```

Edite o arquivo `.env` e configure:

```env
# Database URLs - Para desenvolvimento local com Docker
POSTGRES_PRISMA_URL="postgresql://postgres:docker@localhost:5432/messages"
POSTGRES_URL_NON_POOLING="postgresql://postgres:docker@localhost:5432/messages"

# GitHub OAuth - Obtenha em https://github.com/settings/developers
GITHUB_CLIENT_ID="seu_client_id_aqui"
GITHUB_CLIENT_SECRET="seu_client_secret_aqui"

# JWT Secret - Use uma string aleatória e segura
JWT_SECRET="sua_chave_secreta_aqui"
```

### 4. Inicie o banco de dados PostgreSQL com Docker

O projeto está configurado para usar PostgreSQL via Docker Compose:

```bash
# Inicia o container PostgreSQL em background
npm run docker:up

# Verificar se o container está rodando
docker ps
```

**Configurações do Container:**
- **Imagem**: `postgres:15-alpine`
- **Porta**: `5432`
- **Usuário**: `postgres`
- **Senha**: `docker`
- **Database**: `messages`
- **Volume**: Dados persistentes em `postgres_data`

**Comandos úteis do Docker:**

```bash
# Parar o container
npm run docker:down

# Ver logs do PostgreSQL
npm run docker:logs

# Reiniciar o container
npm run docker:down && npm run docker:up
```

### 5. Execute as migrations do Prisma

Após o banco estar rodando, execute as migrations:

```bash
npm run prisma:migrate
```

Isso criará as tabelas necessárias no banco de dados.

### 6. (Opcional) Abra o Prisma Studio

Para visualizar e gerenciar os dados do banco:

```bash
npm run prisma:studio
```

Acesse em: http://localhost:5555

### 7. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O servidor estará rodando em: http://localhost:4000

## 📡 Endpoints da API

### Autenticação

**POST** `/authenticate`
```json
{
  "code": "github_oauth_code"
}
```
Resposta:
```json
{
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "name": "Nome do Usuário",
    "github_id": 123456,
    "avatar_url": "https://...",
    "login": "username"
  }
}
```

### Mensagens

**POST** `/messages` (requer autenticação)
```json
{
  "message": "Texto da mensagem"
}
```
Headers:
```
Authorization: Bearer {token}
```

**GET** `/messages/last3`

Retorna as últimas 3 mensagens.

### Perfil

**GET** `/profile` (requer autenticação)

Headers:
```
Authorization: Bearer {token}
```

### OAuth GitHub

**GET** `/github`

Redireciona para página de autenticação do GitHub.

**GET** `/signin/callback`

Callback do GitHub OAuth.

## 🔌 WebSocket

O servidor Socket.IO está configurado na porta **4000**.

**Eventos:**

- `connection` - Cliente conectado
- `new_message` - Nova mensagem enviada

Exemplo de payload:
```json
{
  "id": "uuid",
  "text": "Mensagem",
  "user_id": "uuid",
  "created_at": "2025-11-06T...",
  "user": {
    "name": "Nome",
    "avatar_url": "https://..."
  }
}
```

## 🗄️ Estrutura do Banco de Dados

### User
```prisma
model User {
  id         String    @id @default(uuid())
  name       String
  github_id  Int
  avatar_url String
  login      String
  messages   Message[]
}
```

### Message
```prisma
model Message {
  id         String   @id @default(uuid())
  text       String
  created_at DateTime @default(now())
  user_id    String
  user       User     @relation(fields: [user_id], references: [id])
}
```

## 🏗️ Estrutura do Projeto

```
messages-nodejs/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── migrations/            # Migrations do Prisma
├── src/
│   ├── @types/               # Definições de tipos TypeScript
│   ├── controllers/          # Controllers da aplicação
│   ├── errors/               # Classes de erro customizadas
│   ├── middleware/           # Middlewares (auth, errorHandler)
│   ├── prisma/               # Cliente Prisma
│   ├── services/             # Lógica de negócio
│   ├── utils/                # Utilitários
│   ├── app.ts                # Configuração do Express e Socket.IO
│   ├── routes.ts             # Definição de rotas
│   └── server.ts             # Entrada da aplicação
├── docker-compose.yml        # Configuração Docker
├── tsconfig.json            # Configuração TypeScript
└── package.json             # Dependências e scripts
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev                   # Inicia servidor em modo dev

# Docker
npm run docker:up            # Inicia PostgreSQL
npm run docker:down          # Para PostgreSQL
npm run docker:logs          # Ver logs do container

# Prisma
npm run prisma:migrate       # Executa migrations
npm run prisma:studio        # Abre Prisma Studio

# Produção (Vercel)
npm run vercel-build         # Deploy das migrations
```

## 🌐 Deploy (Vercel)

O projeto está configurado para deploy na Vercel:

1. Configure as variáveis de ambiente no painel da Vercel
2. O comando `vercel-build` executará as migrations automaticamente
3. Use PostgreSQL em produção (Vercel Postgres, Supabase, etc.)

## 🔐 Segurança

- ✅ Tratamento de erros centralizado
- ✅ Validação de inputs
- ✅ Autenticação JWT
- ✅ Middleware de autenticação
- ✅ Variáveis de ambiente para dados sensíveis
- ✅ CORS configurado

## 📝 Melhorias Implementadas

- ✅ Middleware global de tratamento de erros
- ✅ Classe `AppError` para erros customizados
- ✅ Validação de mensagens (tamanho máximo: 500 caracteres)
- ✅ Verificação de usuário existente
- ✅ Tratamento de erros assíncronos
- ✅ Logs de erro para debugging

## 🤝 Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👤 Autor

**Kevin Cruz**
- GitHub: [@kevinmcruzp](https://github.com/kevinmcruzp)

---

Desenvolvido com ❤️ usando Node.js e TypeScript
