import Joi from "joi";
import { isProd } from "../config/env.config.js";
import { Prisma } from "../generated/prisma/index.js";
import AppError from "../utils/appError.js";

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // Joi Validation Error
  if (err instanceof Joi.ValidationError) {
    return res.status(400).json({
      message: "Validation Error",
      errors: err.details.map((error) => {
        return {
          field: error.path.join("."),
          message: error.message.replace(/['"]/g, ""),
          value: error.context?.value,
          type: error.type,
        };
      }),
    });
  }

  // Prisma errors

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        message: "Duplicate field value entered",
        field: err.meta?.target?.[0],
      });
    }

    if (err.code === "P2025") {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    return res.status(400).json({
      message: "Database error",
      error: isProd ? undefined : err.message,
      code: err.code,
    });
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      message: "Database Validation Error",
      details: isProd ? "Invalid data format sent to database" : err.message,
    });
  }

  // Generic error

  console.error({ err });

  res.status(500).json({
    message: isProd ? "Internal Server Error" : err.message,
    stack: isProd ? undefined : err.stack,
  });
};

export default errorHandler;
