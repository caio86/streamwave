import Joi from "joi"

import Usuario from "../models/Usuario.js"

class UsuarioService {
  async getById(id) {
    const { error, value } = validateUuid(id)
    if (error) throw error

    const user = await Usuario.findById(value)
    if (!user) throw new Error("User not found")

    return user
  }

  async getByEmail(email) {
    const { error, value } = validateEmail(email)
    if (error) throw error

    const user = await Usuario.findByEmail(value)
    if (!user) throw new Error("User not found")

    return user
  }

  async create(data) {
    const { error, value } = validateCreateUser(data)
    if (error) throw error

    const created = await Usuario.create(value)

    return created
  }

  async update(id, data) {
    const { error: errorUuid } = validateUuid(id)
    if (errorUuid) throw errorUuid

    const user = await Usuario.findById(id)
    if (!user) throw new Error("User not found")

    const { error, value } = validateUpdateUser(data)
    if (error) throw error

    const updated = await Usuario.update(id, value)

    return updated
  }

  async delete(id) {
    const { error, value } = validateUuid(id)
    if (error) throw error

    const user = await Usuario.findById(value)
    if (!user) throw new Error("User not found")

    await Usuario.delete(value)
  }
}

function validateUuid(id) {
  const uuidSchema = Joi.string().guid({ version: 'uuidv4' }).required()
  return uuidSchema.validate(id)
}

function validateEmail(email) {
  const emailSchema = Joi.string().email().required()
  return emailSchema.validate(email)
}

function validateCreateUser(data) {
  const createUserSchema = Joi.object({
    email: Joi.string().email().required(),
    senha: Joi.string().required(),
    nomeCompleto: Joi.string().required(),
    dataNascimento: Joi.date().required(),
    fotoPerfil: Joi.string().uri().optional(),
  })
  return createUserSchema.validate(data)
}

function validateUpdateUser(data) {
  const updateUserSchema = Joi.object({
    email: Joi.string().email().optional(),
    senha: Joi.string().optional(),
    nomeCompleto: Joi.string().optional(),
    dataNascimento: Joi.date().optional(),
    fotoPerfil: Joi.string().uri().optional(),
  })
  return updateUserSchema.validate(data)
}

export default new UsuarioService()