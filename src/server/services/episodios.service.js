import Joi from "joi";

import Episodio from "../models/Episodio.js";

class EpisodioService {
  async getAllByTemporada(temporadaId) {
    const { error } = validateIntId(temporadaId);
    if (error) throw error;

    const episodios = await Episodio.findAllByTemporada(temporadaId);
    return episodios.map(parseEpisodioFromModel);
  }

  async getById(episodioId) {
    const { error } = validateIntId(episodioId);
    if (error) throw error;

    const episodio = await Episodio.findById(episodioId);
    if (!episodio) throw new Error("Episodio not found");

    return parseEpisodioFromModel(episodio);
  }

  async create(temporadaId, data) {
    const { error } = validateIntId(temporadaId);
    if (error) throw error;

    const { error: validationError, value } = validateCreate(data);
    if (validationError) throw validationError;

    const parsedData = parseEpisodioToCreateModel(temporadaId, value);

    const created = await Episodio.create(parsedData);

    return parseEpisodioFromModel(created);
  }

  async update(episodioId, data) {
    const { error } = validateIntId(episodioId);
    if (error) throw error;

    const { error: validationError, value } = validateUpdate(data);
    if (validationError) throw validationError;

    const parsedData = parseEpisodioToUpdateModel(value);

    const updated = await Episodio.update(episodioId, parsedData);

    return parseEpisodioFromModel(updated);
  }

  async delete(episodioId) {
    const { error } = validateIntId(episodioId);
    if (error) throw error;

    const episodio = await Episodio.findById(episodioId);
    if (!episodio) throw new Error("Episodio not found");

    await Episodio.delete(episodioId);
  }
}

/* =======================
   VALIDATIONS
======================= */

function validateIntId(id) {
  const intSchema = Joi.number().integer().min(1).required();
  return intSchema.validate(id);
}

function validateCreate(data) {
  const createEpisodioSchema = Joi.object({
    numero: Joi.number().integer().min(1).required(),
    titulo: Joi.string().required(),
    duracao: Joi.number().integer().min(1).required(),
    sinopse: Joi.string().optional(),
  });

  return createEpisodioSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
}

function validateUpdate(data) {
  const updateEpisodioSchema = Joi.object({
    numero: Joi.number().integer().min(1).optional(),
    titulo: Joi.string().optional(),
    duracao: Joi.number().integer().min(1).optional(),
    sinopse: Joi.string().optional(),
  });

  return updateEpisodioSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
}

/* =======================
   PARSERS
======================= */

function parseEpisodioToCreateModel(temporadaId, data) {
  return {
    numeroEpisodio: data.numero,
    titulo: data.titulo,
    duracao: data.duracao,
    sinopse: data.sinopse,
    temporada: {
      connect: {
        id: Number(temporadaId),
      },
    },
  };
}

function parseEpisodioToUpdateModel(data) {
  return {
    numeroEpisodio: data.numero,
    titulo: data.titulo,
    duracao: data.duracao,
    sinopse: data.sinopse,
  };
}

function parseEpisodioFromModel(episodio) {
  return {
    id: episodio.id,
    numero: episodio.numeroEpisodio,
    titulo: episodio.titulo,
    duracao: episodio.duracao,
    sinopse: episodio.sinopse,
    temporada_id: episodio.temporadaId,
  };
}

export default new EpisodioService();
