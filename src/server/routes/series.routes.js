import { Router } from "express";
import SerieController from "../controllers/serie.controller.js";
import temporadaRoutes from "./temporada.routes.js";

const routes = Router();

routes.get("/", SerieController.index);
routes.get("/:conteudoId", SerieController.getByID);
routes.post("/", SerieController.create);
routes.put("/:conteudoId", SerieController.update);
routes.delete("/:conteudoId", SerieController.delete);

// Rotas aninhadas de temporadas
routes.use("/:conteudoId/temporadas", temporadaRoutes);

export default routes;
