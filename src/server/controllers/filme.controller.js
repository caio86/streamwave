import FilmeService from "../services/filme.service.js";

class FilmeController {
  async index(req, res, next) {
    try {
      const filmes = await FilmeService.getAll();
      res.json(filmes);
    } catch (err) {
      next(err);
    }
  }

  async getByID(req, res, next) {
    try {
      const { conteudoId } = req.params;

      const filme = await FilmeService.getById(conteudoId);

      res.json(filme);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const createdFilme = await FilmeService.create(req.body);
      res.status(201).json(createdFilme);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { conteudoId } = req.params;

      const updatedFilme = await FilmeService.update(conteudoId, req.body);

      res.json(updatedFilme);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { conteudoId } = req.params;

      await FilmeService.delete(conteudoId);

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async uploadFile(req, res, next) {
    try {
      const { conteudoId } = req.params;

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const updatedFilme = await FilmeService.uploadVideo(conteudoId, req.file);

      res.json(updatedFilme);
    } catch (err) {
      next(err);
    }
  }
}

export default new FilmeController();
