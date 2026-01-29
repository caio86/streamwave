import SerieService from "../services/serie.service.js";

class SerieController {
  async index(req, res, next) {
    try {
      const series = await SerieService.getAll();
      res.json(series);
    } catch (err) {
      next(err);
    }
  }

  async getByID(req, res, next) {
    try {
      const { conteudoId } = req.params;

      const serie = await SerieService.getById(conteudoId);

      res.json(serie);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const createdSerie = await SerieService.create(req.body);
      res.status(201).json(createdSerie);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { conteudoId } = req.params;

      const updatedSerie = await SerieService.update(conteudoId, req.body);

      res.json(updatedSerie);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { conteudoId } = req.params;

      await SerieService.delete(conteudoId);

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default new SerieController();
