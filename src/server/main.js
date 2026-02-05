import express from "express";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes/index.js";
import { PORT } from "./config/env.config.js";
import errorHandler from "./middlewares/errorHandler.js";
import storageService from "./services/storage.service.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./docs/swagger.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use("/api/v1", routes);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "UP",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use((_req, res) => {
  res.status(404).json({
    message: "404 - Rota inexistente",
  });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await storageService.initBucket();

    app.listen(PORT, () => {
      console.log("Server is running...");
    });
  } catch (error) {
    console.log("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
