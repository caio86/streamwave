import EpisodioService from "../services/episodio.service.js";

class EpisodioController {
  async index(req, res, next) {
    try {
      const { temporadaId } = req.params;

      const episodios = await EpisodioService.getAllByTemporada(
        temporadaId
      );

      res.json(episodios);
    } catch (err) {
      next(err);
    }
  }

  async getByID(req, res, next) {
    try {
      const { episodioId } = req.params;

      const episodio = await EpisodioService.getById(episodioId);

      res.json(episodio);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { temporadaId } = req.params;

      const createdEpisodio = await EpisodioService.create(
        temporadaId,
        req.body
      );

      res.status(201).json(createdEpisodio);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { episodioId } = req.params;

      const updatedEpisodio = await EpisodioService.update(
        episodioId,
        req.body
      );

      res.json(updatedEpisodio);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { episodioId } = req.params;

      await EpisodioService.delete(episodioId);

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default new EpisodioController();
