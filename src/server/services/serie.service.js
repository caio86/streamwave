import Joi from "joi";
import Serie from "../models/Serie.js";

class SerieService {
  async getAll() {
    const series = await Serie.findAll();
    return series.map(parseSerieFromModel);
  }

  async getById(conteudoId) {
    const { error } = validateUuid(conteudoId);
    if (error) throw error;

    const serie = await Serie.findById(conteudoId);
    if (!serie) throw new Error("Serie not found");

    return parseSerieFromModel(serie);
  }

  async create(data) {
    const { error, value } = validateCreate(data);
    if (error) throw error;

    const parsedData = parseSerieToCreateModel(value);

    const created = await Serie.create(parsedData);

    return parseSerieFromModel(created);
  }

  async update(conteudoId, data) {
    const { error } = validateUuid(conteudoId);
    if (error) throw error;

    const { error: validationError, value } = validateUpdate(data);
    if (validationError) throw validationError;

    const parsedData = parseSerieToUpdateModel(value);

    const updated = await Serie.update(conteudoId, parsedData);

    return parseSerieFromModel(updated);
  }

  async delete(conteudoId) {
    const { error } = validateUuid(conteudoId);
    if (error) throw error;

    const serie = await Serie.findById(conteudoId);
    if (!serie) throw new Error("Serie not found");

    await Serie.delete(conteudoId);
  }
}

/* =======================
   VALIDATIONS
======================= */

function validateUuid(id) {
  const uuidSchema = Joi.string().guid({ version: "uuidv4" }).required();
  return uuidSchema.validate(id);
}

function validateCreate(data) {
  const createSerieSchema = Joi.object({
    titulo: Joi.string().required(),
    banner: Joi.string().uri().optional(),
    poster: Joi.string().uri().optional(),
    genero: Joi.array().items(Joi.string()).unique().default([]),
    sinopse: Joi.string().optional(),
    data_lancamento: Joi.date().optional(),
    classificacao: Joi.string().optional(),
    destaque: Joi.bool().default(false),
    tipo: Joi.string().uppercase().valid("SERIE").required(),

    temporadas: Joi.array().items(
      Joi.object({
        numero: Joi.number().integer().required(),
        episodios: Joi.array().items(
          Joi.object({
            titulo: Joi.string().required(),
            numero: Joi.number().integer().required(),
            duracao: Joi.number().integer().required(),
          })
        ).default([]),
      })
    ).default([]),
  });

  return createSerieSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
}

function validateUpdate(data) {
  const updateSerieSchema = Joi.object({
    titulo: Joi.string().optional(),
    banner: Joi.string().uri().optional(),
    poster: Joi.string().uri().optional(),
    genero: Joi.array().items(Joi.string()).unique().optional(),
    sinopse: Joi.string().optional(),
    data_lancamento: Joi.date().optional(),
    classificacao: Joi.string().optional(),
    destaque: Joi.bool().optional(),
    tipo: Joi.string().uppercase().valid("SERIE").optional(),

    temporadas: Joi.array().items(
      Joi.object({
        numero: Joi.number().integer().required(),
        episodios: Joi.array().items(
          Joi.object({
            titulo: Joi.string().optional(),
            numero: Joi.number().integer().optional(),
            duracao: Joi.number().integer().optional(),
          })
        ).optional(),
      })
    ).optional(),
  });

  return updateSerieSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
}

/* =======================
   PARSERS
======================= */

function parseSerieToCreateModel(data) {
  return {
    conteudo: {
      create: {
        titulo: data.titulo,
        banner: data.banner,
        poster: data.poster,
        genero: data.genero,
        sinopse: data.sinopse,
        dataLancamento: data.data_lancamento,
        classificacao: data.classificacao,
        destaque: data.destaque,
        tipo: data.tipo,
      },
    },
    temporadas: {
      create: data.temporadas.map((temporada) => ({
        numero: temporada.numero,
        episodios: {
          create: temporada.episodios.map((episodio) => ({
            titulo: episodio.titulo,
            numero: episodio.numero,
            duracao: episodio.duracao,
          })),
        },
      })),
    },
  };
}

function parseSerieToUpdateModel(data) {
  return {
    conteudo: {
      update: {
        titulo: data.titulo,
        banner: data.banner,
        poster: data.poster,
        genero: data.genero,
        sinopse: data.sinopse,
        dataLancamento: data.data_lancamento,
        classificacao: data.classificacao,
        destaque: data.destaque,
        tipo: data.tipo,
      },
    },
    // Atualização de temporadas normalmente é mais complexa
    // (upsert/delete). Aqui deixei simples e explícito.

    ...(data.temporadas && {
      temporadas: {
        deleteMany: {},
        create: data.temporadas.map((temporada) => ({
          numero: temporada.numero,
          episodios: {
            create: temporada.episodios?.map((episodio) => ({
              titulo: episodio.titulo,
              numero: episodio.numero,
              duracao: episodio.duracao,
            })) || [],
          },
        })),
      },
    }),
  };
}

function parseSerieFromModel(serie) {
  return {
    id: serie.conteudoId,
    titulo: serie.conteudo.titulo,
    banner: serie.conteudo.banner,
    poster: serie.conteudo.poster,
    genero: serie.conteudo.genero,
    sinopse: serie.conteudo.sinopse,
    data_lancamento: serie.conteudo.dataLancamento,
    classificacao: serie.conteudo.classificacao,
    destaque: serie.conteudo.destaque,
    tipo: serie.conteudo.tipo,

    temporadas: serie.temporadas?.map((temporada) => ({
      numero: temporada.numero,
      episodios: temporada.episodios.map((episodio) => ({
        titulo: episodio.titulo,
        numero: episodio.numero,
        duracao: episodio.duracao,
      })),
    })) || [],
  };
}

export default new SerieService();
