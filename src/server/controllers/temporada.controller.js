import TemporadaService from "../services/temporadas.service.js";

class TemporadaController {
  async index(req, res, next) {
    try {
      const { conteudoId } = req.params;

      const temporadas = await TemporadaService.getAllBySerie(conteudoId);

      res.json(temporadas);
    } catch (err) {
      next(err);
    }
  }

  async getByID(req, res, next) {
    try {
      const { temporadaId } = req.params;

      const temporada = await TemporadaService.getById(temporadaId);

      res.json(temporada);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { conteudoId } = req.params;

      const createdTemporada = await TemporadaService.create(
        conteudoId,
        req.body
      );

      res.status(201).json(createdTemporada);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { temporadaId } = req.params;

      const updatedTemporada = await TemporadaService.update(
        temporadaId,
        req.body
      );

      res.json(updatedTemporada);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { temporadaId } = req.params;

      await TemporadaService.delete(temporadaId);

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default new TemporadaController();
