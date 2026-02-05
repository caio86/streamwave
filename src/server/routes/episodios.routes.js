import { Router } from "express";
import EpisodioController from "../controllers/episodio.controller.js";

const routes = Router({ mergeParams: true });

routes.get("/", EpisodioController.index);
routes.get("/:episodioId", EpisodioController.getByID);
routes.post("/", EpisodioController.create);
routes.put("/:episodioId", EpisodioController.update);
routes.delete("/:episodioId", EpisodioController.delete);

export default routes;
