# 🌊 StreamWave

**StreamWave** é uma plataforma de streaming VOD (Video on Demand) completa, projetada para escalabilidade e interação social. O sistema atua como um catálogo robusto de filmes e séries, combinando a performance do streaming adaptativo (HLS) com funcionalidades de "WatchParty" para assistir em grupo.

## 📖 Visão Geral

O projeto utiliza uma arquitetura moderna que separa o armazenamento de metadados do armazenamento de arquivos pesados de mídia:

- **PostgreSQL:** Armazena metadados (títulos, sinopses, usuários, capas).
- **MinIO:** Armazena os arquivos de vídeo brutos e segmentados (compatível com S3).
- **Streaming HLS:** Garante que a qualidade do vídeo se adapte à internet do usuário.

## 🚀 Funcionalidades Principais

- **Catálogo de Conteúdo:** Interface para navegar entre filmes e séries.
- **Streaming Adaptativo (HLS):** O backend processa vídeos via FFmpeg, gerando playlists `.m3u8` que se adaptam à banda do usuário.
- **WatchParty:** Sincronização de vídeo em tempo real entre múltiplos usuários via WebSockets.
- **Player Moderno:** Controles completos de reprodução e seleção de qualidade.
- **Upload e Processamento:** Sistema de upload que automaticamente converte e segmenta vídeos.

## 🛠️ Tecnologias Utilizadas

### Backend (`src/server`)

- **Node.js & Express:** API RESTful.
- **Prisma ORM:** Gerenciamento do banco de dados PostgreSQL.
- **PostgreSQL:** Banco de dados relacional para metadados.
- **MinIO:** Object Storage para vídeos e segmentos.
- **FFmpeg & Fluent-FFmpeg:** Processamento e transcodificação de vídeo.
- **Socket.io:** Comunicação em tempo real.

### Frontend (`src/client`)

- **Vite:** Build tool e servidor de desenvolvimento frontend.
- **HTML5, CSS3, JavaScript:** Interface do usuário.
- **Hls.js:** Player capaz de reproduzir streams HLS.
- **Socket.io-client:** Cliente para conexão com as salas de WatchParty.

---

## ⚙️ Pré-requisitos

Antes de iniciar, certifique-se de ter as seguintes ferramentas instaladas:

1.  **Node.js** (v24+)
2.  **PostgreSQL** (Rodando localmente ou via Docker)
3.  **MinIO Server** (Rodando localmente ou via Docker)
4.  **FFmpeg** (Instalado no SO e acessível via terminal/PATH)

---

## 📦 Instalação e Configuração

Siga as etapas abaixo para configurar o ambiente de desenvolvimento.

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Renomeie o arquivo `.env.example` para `.env` ou crie um novo na raiz do projeto. Preencha com suas configurações locais:

```env
# --- PostgreSQL ---
POSTGRES_USER="johndoe"
POSTGRES_PASSWORD="randompassword"
POSTGRES_DB="mydb"
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"

# String de conexão do Prisma (deve corresponder aos dados acima)
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"

# --- Backend Config ---
BCRYPT_SALT=10
JWT_SECRET="sua_chave_secreta_segura"
JWT_EXPIRES_IN="1h"
PORT=3000

# --- Armazenamento (MinIO / S3) ---
AWS_REGION="us-east-1"
S3_ENDPOINT="http://localhost:9000"
BUCKET_NAME="streamwave-bucket"

# --- Credenciais MinIO ---
MINIO_ROOT_USER="minioadmin"
MINIO_ROOT_PASSWORD="minioadminpassword"
MINIO_PORT="9000"
MINIO_WEB_UI_PORT="9001"

# --- Frontend (Vite) ---
VITE_API_ENDPOINT="http://localhost:3000/api/v1"

```

### 3. Configurar o Banco de Dados

Para inicializar o esquema do banco de dados e gerar o cliente Prisma, execute os comandos obrigatórios:

```bash
# Gera os tipos do Prisma Client baseados no schema
npm run prisma:generate

# Aplica as migrações para criar as tabelas no PostgreSQL
npm run prisma:migrate:deploy

```

---

## ▶️ Como Executar

O projeto é dividido em backend e frontend. Você precisará de dois terminais abertos.

### Terminal 1: Backend

Inicia o servidor API e WebSocket (localizado em `src/server`).

```bash
npm run dev:server

```

_O servidor deve iniciar na porta definida em `PORT` (padrão 3000)._

### Terminal 2: Frontend

Inicia a interface do usuário (localizada em `src/client`).

```bash
npm run dev:client

```

_O Vite iniciará o servidor frontend, geralmente acessível em http://localhost:5173._

---

## 📂 Estrutura de Pastas

```
streamwave/
├── src/
│   ├── client/         # Frontend (Vite, HTML, CSS, JS)
│   └── server/         # Backend (Express, Controllers, Services)
│       └── prisma/     # Schemas e migrações do banco de dados
├── .env                # Variáveis de ambiente
├── package.json        # Scripts e dependências
└── README.md           # Documentação

```

---

## 👥 Autores

- **Caio Luiz Lacerda Terto Silva**
- **Felipe da Silva Oliveira**
- **Gabriel Gomes Castanha Maiolo**

---

## 📄 Licença

Este projeto está licenciado sob a licença **GPL-3.0**.
