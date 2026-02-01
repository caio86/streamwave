import usuarioService from "../services/usuario.service.js";

class UsuarioController {
  async getById(req, res, next) {
    try {
      const user = await usuarioService.getById(req.params.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async getByUsername(req, res, next) {
    try {
      const user = await usuarioService.getByUsername(req.params.username);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async getByEmail(req, res, next) {
    try {
      const user = await usuarioService.getByEmail(req.params.email);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const { user, token } = await usuarioService.create(req.body);
      res.status(201).json({ user, token });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await usuarioService.update(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await usuarioService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const token = await usuarioService.login(req.body.email, req.body.senha);
      res.json({ token });
    } catch (error) {
      next(error);
    }
  }
}

export default new UsuarioController();
