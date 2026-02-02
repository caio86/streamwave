import { Router } from "express";
import filmesRoutes from "./filmes.routes.js";
import seriesRoutes from "./series.routes.js";
import temporadaRoutes from "./temporadas.routes.js";
import episodiosRoutes from "./episodios.routes.js";

const routes = Router();

routes.use("/filmes", filmesRoutes);
routes.use("/series", seriesRoutes);
routes.use("/series/:conteudoId/temporadas", temporadaRoutes);
routes.use("/temporadas/:temporadaId/episodios", episodiosRoutes);


export default routes;
