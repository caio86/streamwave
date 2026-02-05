import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "StreamWave API",
      version: "1.0",
      description: "Documentação da API do StreamWave.",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
      },
    ],
    tags: [
      {
        name: "Filmes",
        description: "Endpoints da API para gerenciamento de filmes",
      },
      {
        name: "Usuarios",
        description: "Endpoints da API para gerenciamento de usuários",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Filme: {
          allOf: [
            {
              $ref: "#/components/schemas/Conteudo",
            },
            {
              type: "object",
              required: ["duracao_total"],
              properties: {
                duracao_total: {
                  type: "integer",
                  description: "Duração total do filme em minutos",
                },
              },
            },
          ],
        },
        Conteudo: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Identificador único do conteúdo",
              example: "7f9c4b2a-1a2b-4c3d-9e0f-123456789abc",
            },
            titulo: {
              type: "string",
              description: "Título do conteúdo",
              example: "Minha Obra",
            },
            banner: {
              type: "string",
              description: "URL da imagem de banner",
              example: "https://example.com/banner.jpg",
            },
            poster: {
              type: "string",
              description: "URL do poster",
              example: "https://example.com/poster.jpg",
            },
            genero: {
              type: "array",
              items: { type: "string" },
              description: "Lista de gêneros",
              example: ["DRAMA", "SUSPENSE"],
            },
            sinopse: {
              type: "string",
              description: "Sinopse do conteúdo",
              example: "Resumo curto do conteúdo",
            },
            dataLancamento: {
              type: "string",
              format: "date",
              description: "Data de lançamento",
              example: "2020-12-01",
            },
            classificacao: {
              type: "string",
              description: "Classificação etária",
              example: "16 anos",
            },
            destaque: {
              type: "boolean",
              description: "Indica se é destaque",
              example: true,
            },
            tipo: {
              type: "string",
              description: "Tipo do conteúdo (SERIE ou FILME)",
              enum: ["SERIE", "FILME"],
              example: "SERIE",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Data de criação no sistema",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Data da última atualização",
            },
          },
          required: ["titulo", "tipo"],
        },
        Serie: {
          allOf: [
            { $ref: "#/components/schemas/Conteudo" },
            {
              type: "object",
              properties: {
                conteudoId: {
                  type: "string",
                  format: "uuid",
                  description: "FK para Conteudo (conteudoId)",
                  example: "7f9c4b2a-1a2b-4c3d-9e0f-123456789abc",
                },
                temporadas: {
                  type: "array",
                  description: "Temporadas associadas à série",
                  items: { $ref: "#/components/schemas/Temporada" },
                },
              },
              required: ["conteudoId"],
            },
          ],
        },
        Temporada: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              format: "int32",
              description: "Identificador interno da temporada",
              example: 1,
            },
            numero: {
              type: "integer",
              description: "Número da temporada",
              example: 1,
            },
            titulo: {
              type: "string",
              nullable: true,
              description: "Título opcional da temporada",
              example: "Temporada Um",
            },
            sinopse: {
              type: "string",
              nullable: true,
              description: "Sinopse da temporada",
              example: "Sinopse da temporada",
            },
            serieId: {
              type: "string",
              format: "uuid",
              description: "FK para Serie.conteudoId",
              example: "7f9c4b2a-1a2b-4c3d-9e0f-123456789abc",
            },
            episodios: {
              type: "array",
              description: "Lista de episódios da temporada",
              items: { $ref: "#/components/schemas/Episodio" },
            },
          },
          required: ["numero", "serieId"],
        },
        Episodio: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              format: "int32",
              description: "Identificador do episódio",
              example: 1,
            },
            titulo: {
              type: "string",
              description: "Título do episódio",
              example: "Piloto",
            },
            numeroEpisodio: {
              type: "integer",
              description: "Número do episódio na temporada",
              example: 1,
            },
            duracao: {
              type: "integer",
              description: "Duração em minutos",
              example: 45,
            },
            sinopse: {
              type: "string",
              nullable: true,
              description: "Sinopse do episódio",
              example: "Resumo do episódio",
            },
            temporadaId: {
              type: "integer",
              description: "FK para Temporada.id",
              example: 1,
            },
          },
          required: ["titulo", "numeroEpisodio", "duracao", "temporadaId"],
        },
        Usuario: {
          type: "object",
          required: [
            "nome_completo",
            "email",
            "senha",
            "username",
            "data_nascimento",
          ],
          properties: {
            id: {
              type: "string",
              description: "Identificador único do usuário",
              readOnly: true,
            },
            nome_completo: {
              type: "string",
              description: "Nome completo do usuário",
            },
            username: {
              type: "string",
              description: "Nome de usuário único",
            },
            email: {
              type: "string",
              format: "email",
              description: "Endereço de email do usuário",
            },
            senha: {
              type: "string",
              format: "password",
              description: "Senha do usuário",
              writeOnly: true,
            },
            foto_perfil: {
              type: "string",
              description: "URL da foto de perfil do usuário",
            },
            data_nascimento: {
              type: "string",
              format: "date",
              description: "Data de nascimento do usuário",
            },
            data_cadastro: {
              type: "string",
              format: "date-time",
              description: "Data de cadastro",
              readOnly: true,
            },
          },
        },
      },
    },
  },
  apis: ["./src/server/routes/*.routes.js"],
};

export default swaggerJsdoc(options);
