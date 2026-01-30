import Joi from "joi";
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import {
  BCRYPT_SALT,
  JWT_EXPIRES_IN,
  JWT_SECRET,
} from "../config/env.config.js";
import jwt from "jsonwebtoken";

const saltRounds = parseInt(BCRYPT_SALT ?? "10", 10);

class UsuarioService {
  async getById(id) {
    const { error, value } = validateUuid(id);
    if (error) throw error;

    const user = await Usuario.findById(value);
    if (!user) throw new Error("User not found");

    return user;
  }

  async getByEmail(email) {
    const { error, value } = validateEmail(email);
    if (error) throw error;

    const user = await Usuario.findByEmail(value);
    if (!user) throw new Error("User not found");

    return user;
  }

  async create(data) {
    const { error, value } = validateCreateUser(data);
    if (error) throw error;

    const hashedPassword = await bcrypt.hash(value.senha, saltRounds);
    value.senha = hashedPassword;

    const created = await Usuario.create(value);

    return created;
  }

  async update(id, data) {
    const { error: errorUuid } = validateUuid(id);
    if (errorUuid) throw errorUuid;

    const user = await Usuario.findById(id);
    if (!user) throw new Error("User not found");

    const hashedPassword = await bcrypt.hash(data.senha, saltRounds);
    data.senha = hashedPassword;

    const { error, value } = validateUpdateUser(data);
    if (error) throw error;

    const updated = await Usuario.update(id, value);

    return updated;
  }

  async delete(id) {
    const { error, value } = validateUuid(id);
    if (error) throw error;

    const user = await Usuario.findById(value);
    if (!user) throw new Error("User not found");

    await Usuario.delete(value);
  }

  async login(email, password) {
    const user = await this.getByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    return { user, token };
  }
}

function validateUuid(id) {
  const uuidSchema = Joi.string().guid({ version: "uuidv4" }).required();
  return uuidSchema.validate(id);
}

function validateEmail(email) {
  const emailSchema = Joi.string().email().required();
  return emailSchema.validate(email);
}

function validateCreateUser(data) {
  const createUserSchema = Joi.object({
    email: Joi.string().email().required(),
    senha: Joi.string()
      .regex(/\w*[a-z]\w*/) // at least one lowercase letter
      .regex(/\w*[A-Z]\w*/) // at least one uppercase letter
      .regex(/\d/) // at least one digit
      .regex(/\W/) // at least one special character
      .min(3)
      .required(),
    nomeCompleto: Joi.string().required(),
    dataNascimento: Joi.date().required(),
    fotoPerfil: Joi.string().uri().optional(),
  });
  return createUserSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
}

function validateUpdateUser(data) {
  const updateUserSchema = Joi.object({
    email: Joi.string().email().optional(),
    senha: Joi.string().optional(),
    nomeCompleto: Joi.string().optional(),
    dataNascimento: Joi.date().optional(),
    fotoPerfil: Joi.string().uri().optional(),
  });
  return updateUserSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
}

export default new UsuarioService();
