import "dotenv/config"
import express from "express"
import morgan from "morgan"
import cors from "cors"

import ViteExpress from "vite-express"

import routes from "./routes"

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan("dev"))

app.use("/api", routes)

app.use((req, res, next) => {
	res.status(404).json({
		status: 404,
		message: "404 - Not Found"
	})
})

app.use((err, req, res, next) => {
	console.error(err)

	const statusCode = err.status || 500
	const message = err.message || "Internal Server Error"

	res.status(statusCode).json({
		status: statusCode,
		message: message,
	})
})


const server = app.listen(PORT, () => {
	console.log("Server is running...")
})
ViteExpress.bind(app, server);
