import { Router } from "express";
import TemporadaController from "../controllers/temporada.controller.js";

const routes = Router({ mergeParams: true });

routes.get("/", TemporadaController.index);
routes.get("/:temporadaId", TemporadaController.getByID);
routes.post("/", TemporadaController.create);
routes.put("/:temporadaId", TemporadaController.update);
routes.delete("/:temporadaId", TemporadaController.delete);

export default routes;
