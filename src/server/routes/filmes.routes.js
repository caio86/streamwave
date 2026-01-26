import { Router } from "express"
import FilmeController from "../controllers/filme.controller.js"

const routes = Router()

routes.get("/", FilmeController.index)
routes.get("/:conteudoId", FilmeController.getByID)
routes.post("/", FilmeController.create)
routes.put("/:conteudoId", FilmeController.update)
routes.delete("/:conteudoId", FilmeController.delete)

export default routes;
