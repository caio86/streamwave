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
          required: ["tipo"],
          properties: {
            id: {
              type: "string",
              description: "Identificador único do conteúdo",
              readOnly: true,
            },
            titulo: {
              type: "string",
              description: "Título do conteúdo",
            },
            banner: {
              type: "string",
              description: "URL da imagem de banner do conteúdo",
            },
            poster: {
              type: "string",
              description: "URL da imagem de poster do conteúdo",
            },
            genero: {
              type: "array",
              description: "Gêneros do conteúdo",
              items: {
                type: "string",
              },
            },
            sinopse: {
              type: "string",
              description: "Sinopse do conteúdo",
            },
            data_lancamento: {
              type: "string",
              format: "date",
              description: "Data de lançamento do conteúdo",
            },
            classificacao: {
              type: "string",
              description: "Classificação etária do conteúdo",
            },
            destaque: {
              type: "boolean",
              description: "Indica se o conteúdo é destaque",
            },
            tipo: {
              type: "string",
              description: "Tipo do conteúdo (ex.: FILME, SERIE)",
            },
          },
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
