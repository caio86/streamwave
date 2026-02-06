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

Para executar o projeto, você pode optar pelo método **Docker (recomendado)** ou **Manual**.

### Para execução com Docker:

- **Docker** e **Docker Compose** instalados.

### Para execução Manual:

1. **Node.js** (v24+)
2. **PostgreSQL** (Rodando localmente)
3. **MinIO Server** (Rodando localmente)
4. **FFmpeg** (Instalado no SO e acessível via terminal/PATH)

---

## 🐳 Executando com Docker (Recomendado)

A maneira mais simples de rodar o StreamWave é utilizando o Docker Compose, que sobe automaticamente o Banco de Dados, o MinIO, o Backend e o Frontend.

### 1. Configurar Variáveis para Docker

Crie um arquivo `.env` na raiz do projeto. Para o Docker funcionar corretamente, **é necessário ajustar os hosts** para apontarem para os nomes dos serviços (`db` e `minio`) ao invés de `localhost`.

Exemplo de `.env` otimizado para Docker:

```env
# --- PostgreSQL ---
POSTGRES_USER="user"
POSTGRES_PASSWORD="password"
POSTGRES_DB="streamwave_db"
# IMPORTANTE: No Docker, o host deve ser o nome do serviço no compose ('db')
POSTGRES_HOST="db"
POSTGRES_PORT="5432"

# --- Backend Config ---
BCRYPT_SALT=10
JWT_SECRET="sua_chave_secreta_docker"
JWT_EXPIRES_IN="1h"
PORT=3000

# --- Armazenamento (MinIO / S3) ---
AWS_REGION="us-east-1"
# IMPORTANTE: O backend acessa o MinIO internamente via 'http://minio:9000'
S3_ENDPOINT="http://minio:9000"
BUCKET_NAME="streamwave-bucket"

# --- Credenciais MinIO ---
MINIO_ROOT_USER="minioadmin"
MINIO_ROOT_PASSWORD="minioadmin"
MINIO_PORT="9000"
MINIO_WEB_UI_PORT="9001"

# --- Frontend (Vite) ---
# O navegador (fora do Docker) acessa a API via localhost
VITE_API_ENDPOINT="http://localhost:3000/api/v1"

```

### 2. Inicializar os Containers

Na raiz do projeto, execute:

```bash
docker compose up --build

```

O Docker irá:

1. Baixar as imagens do Postgres e MinIO.
2. Construir a imagem do Backend e rodar as migrações (via `entrypoint`).
3. Construir a imagem do Frontend.

### 3. Acessar a Aplicação

Após o build finalizar, acesse:

- **Frontend (Aplicação):** [http://localhost:8080](https://www.google.com/search?q=http://localhost:8080)
- **Backend (API):** [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)
- **MinIO Console (Arquivos):** [http://localhost:9001](https://www.google.com/search?q=http://localhost:9001)

---

## 📦 Instalação e Configuração Manual

Caso prefira rodar sem Docker, siga as etapas abaixo.

### 1. Instalar Dependências

```bash
npm install

```

### 2. Configurar Variáveis de Ambiente

Renomeie o arquivo `.env.example` para `.env` ou crie um novo na raiz do projeto. Preencha com suas configurações locais (usando `localhost`):

```env
# --- PostgreSQL ---
POSTGRES_USER="johndoe"
POSTGRES_PASSWORD="randompassword"
POSTGRES_DB="mydb"
POSTGRES_HOST="localhost" # Para uso manual/local
POSTGRES_PORT="5432"

# String de conexão do Prisma (deve corresponder aos dados acima)
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"

# ... (restante das variáveis)

```

### 3. Configurar o Banco de Dados

Para inicializar o esquema do banco de dados e gerar o cliente Prisma, execute os comandos obrigatórios:

```bash
# Gera os tipos do Prisma Client baseados no schema
npm run prisma:generate

# Aplica as migrações para criar as tabelas no PostgreSQL
npm run prisma:migrate:deploy

```

### 4. Executar

Você precisará de dois terminais abertos.

**Terminal 1: Backend**

```bash
npm run dev:server

```

**Terminal 2: Frontend**

```bash
npm run dev:client

```

---

## 📂 Estrutura de Pastas

```
streamwave/
├── docker/             # Dockerfiles para Backend e Frontend
├── src/
│   ├── client/         # Frontend (Vite, HTML, CSS, JS)
│   └── server/         # Backend (Express, Controllers, Services)
│       └── prisma/     # Schemas e migrações do banco de dados
├── .env                # Variáveis de ambiente
├── compose.yml         # Orquestração Docker
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
