import { Router } from "express";
import filmesRoutes from "./filmes.routes.js";
import seriesRoutes from "./series.routes.js";

const routes = Router();

routes.use("/filmes", filmesRoutes);
routes.use("/series", seriesRoutes);

export default routes;
