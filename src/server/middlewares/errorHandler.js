import Joi from "joi";
import { isProd } from "../config/env.config.js";
import { Prisma } from "../generated/prisma/index.js";

const errorHandler = (err, req, res) => {
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
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({
      message: "Database Error",
      code: err.code,
      meta: err.meta,
    });
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      message: "Database Validation Error",
      details: err.message,
    });
  }

  // Generic error

  if (isProd) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  } else {
    res.status(500).json({
      message: err.message,
    });
  }
};

export default errorHandler;
