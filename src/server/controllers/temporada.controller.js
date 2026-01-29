import TemporadaService from "../services/temporada.service.js";

class TemporadaController {
  async index(req, res, next) {
    try {
      const { serieId } = req.params;

      const temporadas = await TemporadaService.getAllBySerie(serieId);

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
      const { serieId } = req.params;

      const createdTemporada = await TemporadaService.create(
        serieId,
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
