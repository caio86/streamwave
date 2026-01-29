import Joi from "joi";

import Temporada from "../models/Temporada.js";

class TemporadaService {
  async getAllBySerie(serieId) {
    const { error } = validateUuid(serieId);
    if (error) throw error;

    const temporadas = await Temporada.findAllBySerie(serieId);
    return temporadas.map(parseTemporadaFromModel);
  }

  async getById(temporadaId) {
    const { error } = validateUuid(temporadaId);
    if (error) throw error;

    const temporada = await Temporada.findById(temporadaId);
    if (!temporada) throw new Error("Temporada not found");

    return parseTemporadaFromModel(temporada);
  }

  async create(serieId, data) {
    const { error } = validateUuid(serieId);
    if (error) throw error;

    const { error: validationError, value } = validateCreate(data);
    if (validationError) throw validationError;

    const parsedData = parseTemporadaToCreateModel(serieId, value);

    const created = await Temporada.create(parsedData);

    return parseTemporadaFromModel(created);
  }

  async update(temporadaId, data) {
    const { error } = validateUuid(temporadaId);
    if (error) throw error;

    const { error: validationError, value } = validateUpdate(data);
    if (validationError) throw validationError;

    const parsedData = parseTemporadaToUpdateModel(value);

    const updated = await Temporada.update(temporadaId, parsedData);

    return parseTemporadaFromModel(updated);
  }

  async delete(temporadaId) {
    const { error } = validateUuid(temporadaId);
    if (error) throw error;

    const temporada = await Temporada.findById(temporadaId);
    if (!temporada) throw new Error("Temporada not found");

    await Temporada.delete(temporadaId);
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
  const createTemporadaSchema = Joi.object({
    numero: Joi.number().integer().min(1).required(),
    titulo: Joi.string().optional(),
    sinopse: Joi.string().optional(),
  });

  return createTemporadaSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
}

function validateUpdate(data) {
  const updateTemporadaSchema = Joi.object({
    numero: Joi.number().integer().min(1).optional(),
    titulo: Joi.string().optional(),
    sinopse: Joi.string().optional(),
  });

  return updateTemporadaSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
}

/* =======================
   PARSERS
======================= */

function parseTemporadaToCreateModel(serieId, data) {
  return {
    numero: data.numero,
    titulo: data.titulo,
    sinopse: data.sinopse,
    serie: {
      connect: {
        id: serieId,
      },
    },
  };
}

function parseTemporadaToUpdateModel(data) {
  return {
    numero: data.numero,
    titulo: data.titulo,
    sinopse: data.sinopse,
  };
}

function parseTemporadaFromModel(temporada) {
  return {
    id: temporada.id,
    numero: temporada.numero,
    titulo: temporada.titulo,
    sinopse: temporada.sinopse,
    serie_id: temporada.serieId,
    episodios: temporada.episodios
      ? temporada.episodios.map((ep) => ({
          id: ep.id,
          titulo: ep.titulo,
          numero: ep.numero,
          duracao: ep.duracao,
        }))
      : [],
  };
}

export default new TemporadaService();
