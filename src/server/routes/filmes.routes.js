import { Router } from "express"
import Filme from "../models/Filme.js"
import { createFilmeSchema, updateFilmeSchema } from "../validation/filme.schema.js"

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

const routes = Router()

routes.get("/", async (req, res, next) => {
  try {
    const filmes = await Filme.findAll()
    const parsedFilmes = filmes.map((filme) => parseFilmeFromModel(filme))
    res.json(parsedFilmes)
  } catch (err) {
    next(err)
  }
})

routes.get("/:conteudoId", async (req, res, next) => {
  try {
    const { conteudoId } = req.params
    const filme = await Filme.findById(conteudoId)
    if (!filme) return res.status(404).json({ error: "Filme not found" })
    res.json(parseFilmeFromModel(filme))
  } catch (err) {
    next(err)
  }
})

routes.post("/", async (req, res, next) => {
  try {
    const { error, value } = createFilmeSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      throw error
    }

    const data = parseFilmeToCreateModel(value)

    const created = await Filme.create(data)
    res.status(201).json(parseFilmeFromModel(created))
  } catch (err) {
    next(err)
  }
})

routes.put("/:conteudoId", async (req, res, next) => {
  try {
    const { conteudoId } = req.params

    const { error, value } = updateFilmeSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      throw error
    }

    const data = parseFilmeToUpdateModel(value)

    const updated = await Filme.update(conteudoId, data)
    res.json(parseFilmeFromModel(updated))
  } catch (err) {
    next(err)
  }
})

routes.delete("/:conteudoId", async (req, res, next) => {
  try {
    const { conteudoId } = req.params
    await Filme.delete(conteudoId)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

export default routes;
