import express from "express";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes/index.js";
import { PORT } from "./config/env.config.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api", routes);

app.use((_req, res, _next) => {
  res.status(404).json({
    status: 404,
    message: "404 - Not Found",
  });
});

app.use((err, _req, res, _next) => {
  console.error(err);

  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: statusCode,
    message: message,
  });
});

app.listen(PORT, () => {
  console.log("Server is running...");
});
