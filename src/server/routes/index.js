import { Router } from "express";
import filmesRoutes from "./filmes.routes.js";
import seriesRoutes from "./series.routes.js";
import usuariosRoutes from "./usuarios.routes.js";

const routes = Router();

routes.use("/filmes", filmesRoutes);
routes.use("/series", seriesRoutes);
routes.use("/usuarios", usuariosRoutes);

export default routes;
