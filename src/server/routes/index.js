import { Router } from "express"
import filmesRoutes from "./filmes.routes"
import seriesRoutes from "./series.routes"


const routes = Router()

routes.use("/filmes", filmesRoutes)
routes.use("/series", seriesRoutes)

export default routes
