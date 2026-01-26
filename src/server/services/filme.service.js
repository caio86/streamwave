import Joi from "joi"

import Filme from "../models/Filme.js"

class FilmeService {
  async getAll() {
    const filmes = await Filme.findAll()
    return filmes.map(parseFilmeFromModel)
  }

  async getById(conteudoId) {
    const { error } = validateUuid(conteudoId)
    if (error) throw error

    const filme = await Filme.findById(conteudoId)
    if (!filme) throw new Error("Filme not found")

    return parseFilmeFromModel(filme)
  }

  async create(data) {
    const { error, value } = validateCreate(data)
    if (error) throw error

    const parsedData = parseFilmeToCreateModel(value)

    const created = await Filme.create(parsedData)

    return parseFilmeFromModel(created)
  }

  async update(conteudoId, data) {
    const { error } = validateUuid(conteudoId)
    if (error) throw error

    const { error: validationError, value } = validateUpdate(data)
    if (validationError) throw validationError

    const parsedData = parseFilmeToUpdateModel(value)

    const updated = await Filme.update(conteudoId, parsedData)

    return parseFilmeFromModel(updated)
  }

  async delete(conteudoId) {
    const { error } = validateUuid(conteudoId)
    if (error) throw error

    const filme = await Filme.findById(conteudoId)
    if (!filme) throw new Error("Filme not found")

    await Filme.delete(conteudoId)
  }
}

function validateUuid(id) {
  const uuidSchema = Joi.string().guid({ version: 'uuidv4' }).required()
  return uuidSchema.validate(id)
}

function validateCreate(data) {
  const createFilmeSchema = Joi.object({
    titulo: Joi.string().required(),
    banner: Joi.string().uri().optional(),
    poster: Joi.string().uri().optional(),
    genero: Joi.array().items(
      Joi.string()
    ).unique().default([]),
    duracao_total: Joi.number().integer().required(),
    sinopse: Joi.string().optional(),
    data_lancamento: Joi.date().optional(),
    classificacao: Joi.string().optional(),
    destaque: Joi.bool().default(false),
    tipo: Joi.string().uppercase().valid("FILME").required(),
  })

  return createFilmeSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  })
}

function validateUpdate(data) {
  const updateFilmeSchema = Joi.object({
    titulo: Joi.string().optional(),
    banner: Joi.string().uri().optional(),
    poster: Joi.string().uri().optional(),
    genero: Joi.array().items(
      Joi.string()
    ).unique().optional(),
    duracao_total: Joi.number().integer().optional(),
    sinopse: Joi.string().optional(),
    data_lancamento: Joi.date().optional(),
    classificacao: Joi.string().optional(),
    destaque: Joi.bool().optional(),
    tipo: Joi.string().uppercase().valid("FILME").optional(),
  })

  return updateFilmeSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  })
}

function parseFilmeToCreateModel(data) {
  return {
    duracaoTotal: data.duracao_total,
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
      }
    }
  }
}

function parseFilmeToUpdateModel(data) {
  return {
    duracaoTotal: data.duracao_total,
    conteudo: {
      update: {
        titulo: data.titulo,
        banner: data.banner,
        poster: data.poster,
        genero: data.genero,
        sinopse: data.sinopse,
        data_lancamento: data.data_lancamento,
        classificacao: data.classificacao,
        destaque: data.destaque,
        tipo: data.tipo,
      }
    }
  }
}

function parseFilmeFromModel(filme) {
  return {
    id: filme.conteudoId,
    titulo: filme.conteudo.titulo,
    banner: filme.conteudo.banner,
    poster: filme.conteudo.poster,
    genero: filme.conteudo.genero,
    duracao_total: filme.duracaoTotal,
    sinopse: filme.conteudo.sinopse,
    data_lancamento: filme.conteudo.dataLancamento,
    classificacao: filme.conteudo.classificacao,
    destaque: filme.conteudo.destaque,
    tipo: filme.conteudo.tipo,
  }
}

export default new FilmeService()