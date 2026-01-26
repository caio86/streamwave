import express from "express";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes/index.js";
import { PORT } from "./config/env.config.js";
import errorHandler from "./middlewares/errorHandler.js";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger.json" with { type: "json" };

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/v1", routes);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "UP",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use((_req, res, _next) => {
  res.status(404).json({
    status: 404,
    message: "404 - Not Found",
  });
});

app.use(errorHandler)

app.listen(PORT, () => {
  console.log("Server is running...");
});
