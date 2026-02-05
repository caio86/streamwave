import { Router } from "express";
import filmesRoutes from "./filmes.routes.js";
import seriesRoutes from "./series.routes.js";
import temporadaRoutes from "./temporadas.routes.js";
import episodiosRoutes from "./episodios.routes.js";
import usuariosRoutes from "./usuarios.routes.js";
import authMiddleware from "../middlewares/auth.js";

const routes = Router();

routes.use("/filmes", authMiddleware, filmesRoutes);
routes.use("/series", authMiddleware, seriesRoutes);
routes.use("/series/:conteudoId/temporadas", authMiddleware, temporadaRoutes);
routes.use(
  "/temporadas/:temporadaId/episodios",
  authMiddleware,
  episodiosRoutes
);

routes.use("/usuarios", usuariosRoutes);

export default routes;
