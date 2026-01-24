import Joi from "joi";

const validGeneros = [
    "ACAO",
    "AVENTURA",
    "COMEDIA",
    "DRAMA",
    "FICCAO_CIENTIFICA",
    "TERROR",
    "ROMANCE",
    "ANIMACAO",
    "DOCUMENTARIO",
    "SUSPENSE",
    "FANTASIA"
]

export const createFilmeSchema = Joi.object({
    titulo: Joi.string().required(),
    banner: Joi.string().uri().optional(),
    poster: Joi.string().uri().optional(),
    genero: Joi.array().items(
        Joi.string().uppercase().valid(...validGeneros)
    ).unique().default([]),
    duracao_total: Joi.number().integer().required(),
    sinopse: Joi.string().optional(),
    data_lancamento: Joi.date().optional(),
    classificacao: Joi.string().optional(),
    destaque: Joi.bool().default(false),
    tipo: Joi.string().uppercase().valid("FILME").required(),
})

export const updateFilmeSchema = Joi.object({
    titulo: Joi.string().optional(),
    banner: Joi.string().uri().optional(),
    poster: Joi.string().uri().optional(),
    genero: Joi.array().items(
        Joi.string().uppercase().valid(...validGeneros)
    ).unique().optional(),
    duracao_total: Joi.number().integer().optional(),
    sinopse: Joi.string().optional(),
    data_lancamento: Joi.date().optional(),
    classificacao: Joi.string().optional(),
    destaque: Joi.bool().optional(),
    tipo: Joi.string().uppercase().valid("FILME").optional(),
})