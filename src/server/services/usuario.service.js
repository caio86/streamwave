import Joi from "joi";
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import {
  BCRYPT_SALT,
  JWT_EXPIRES_IN,
  JWT_SECRET,
} from "../config/env.config.js";
import jwt from "jsonwebtoken";
import AppError, { STATUS_CODE } from "../utils/appError.js";

class UsuarioService {
  async getById(id) {
    const { error, value } = validateUuid(id);
    if (error) throw error;

    const user = await Usuario.findById(value);
    if (!user) throw new AppError("User not found", STATUS_CODE.NOT_FOUND);

    return parseUsuarioFromModel(user);
  }

  async getByUsername(username) {
    const user = await Usuario.findByUsername(username);
    if (!user) throw new AppError("User not found", STATUS_CODE.NOT_FOUND);

    return parseUsuarioFromModel(user);
  }

  async getByEmail(email) {
    const { error, value } = validateEmail(email);
    if (error) throw error;

    const user = await Usuario.findByEmail(value);
    if (!user) throw new AppError("User not found", STATUS_CODE.NOT_FOUND);

    return parseUsuarioFromModel(user);
  }

  async update(id, data) {
    const { error: errorUuid } = validateUuid(id);
    if (errorUuid) throw errorUuid;

    const user = await Usuario.findById(id);
    if (!user) throw new AppError("User not found", STATUS_CODE.NOT_FOUND);

    if (data.senha !== undefined) {
      const hashedPassword = await hashPassword(data.senha);
      data.senha = hashedPassword;
    }

    const { error, value } = validateUpdateUser(parseUsuarioToModel(data));
    if (error) throw error;

    const updated = await Usuario.update(id, value);

    return parseUsuarioFromModel(updated);
  }

  async delete(id) {
    const { error, value } = validateUuid(id);
    if (error) throw error;

    const user = await Usuario.findById(value);
    if (!user) throw new AppError("User not found", STATUS_CODE.NOT_FOUND);

    await Usuario.delete(value);
  }

  async create(data) {
    const { error, value } = validateCreateUser(data);
    if (error) throw error;

    const hashedPassword = await hashPassword(value.senha);
    value.senha = hashedPassword;

    const created = await Usuario.create(parseUsuarioToModel(value));

    const user = parseUsuarioFromModel(created);

    const payload = {
      sub: user.id,
      username: user.username,
    };

    const token = signToken(payload);

    return { user, token };
  }

  async login(email, password) {
    const user = await this.getByEmail(email);
    if (!user || user.status === "INATIVO") {
      throw new AppError("User not found", STATUS_CODE.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", STATUS_CODE.UNAUTHORIZED);
    }

    await Usuario.updateLastLogin(user.id);

    const payload = {
      sub: user.id,
      username: user.username,
    };

    const token = signToken(payload);
    return { user, token };
  }
}

// Helper functions

const hashPassword = async (password) => {
  const saltRounds = parseInt(BCRYPT_SALT ?? "10", 10);
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

function parseUsuarioToModel(data) {
  return {
    nomeCompleto: data.nome_completo,
    username: data.username,
    senha: data.senha ?? undefined,
    email: data.email,
    fotoPerfil: data.foto_perfil,
    dataNascimento: data.data_nascimento,
    dataCriacao: data.data_cadastro,
  };
}

function parseUsuarioFromModel(data) {
  return {
    id: data.id,
    nome_completo: data.nomeCompleto,
    senha: data.senha ?? undefined,
    username: data.username,
    email: data.email,
    foto_perfil: data.fotoPerfil,
    data_nascimento: data.dataNascimento,
    data_cadastro: data.dataCriacao,
  };
}

// Validation functions

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
    username: Joi.string().alphanum().min(3).max(30).required(),
    nome_completo: Joi.string().required(),
    data_nascimento: Joi.date().required(),
    foto_perfil: Joi.string().uri().optional(),
  });
  return createUserSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
}

function validateUpdateUser(data) {
  const updateUserSchema = Joi.object({
    email: Joi.string().email().optional(),
    senha: Joi.string()
      .regex(/\w*[a-z]\w*/) // at least one lowercase letter
      .regex(/\w*[A-Z]\w*/) // at least one uppercase letter
      .regex(/\d/) // at least one digit
      .regex(/\W/) // at least one special character
      .min(3)
      .optional(),
    username: Joi.string().alphanum().min(3).max(30).optional(),
    nome_completo: Joi.string().optional(),
    data_nascimento: Joi.date().optional(),
    foto_perfil: Joi.string().uri().optional(),
  });
  return updateUserSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
}

export default new UsuarioService();
