import jwt from "jsonwebtoken";
import AppError, { STATUS_CODE } from "../utils/appError.js";
import { JWT_SECRET } from "../config/env.config.js";

const authMiddleware = (req, res, next) => {
  const token = extractToken(req);
  if (!token)
    throw new AppError(
      "Authentication token missing",
      STATUS_CODE.UNAUTHORIZED,
    );

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    throw new AppError("Invalid token", STATUS_CODE.UNAUTHORIZED);
  }
};

const extractToken = (req) => {
  const [type, token] = req.headers.authorization?.split(" ") ?? [];
  console.log({ req, type, token });
  return type === "Bearer" ? token : null;
};

export default authMiddleware;
