import { Router } from "express";
import filmesRoutes from "./filmes.routes.js";
import seriesRoutes from "./series.routes.js";

const routes = Router();

routes.use("/filmes", filmesRoutes);
routes.use("/series", seriesRoutes);

routes.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

export default routes;
