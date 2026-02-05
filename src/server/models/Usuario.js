import { prisma } from "../prisma/prisma.js";

class UsuarioModel {
  async create(data) {
    return await prisma.usuario.create({
      data,
    });
  }

  async findById(id) {
    return await prisma.usuario.findUniqueOrThrow({
      where: { id },
    });
  }

  async findByUsername(username) {
    return await prisma.usuario.findUniqueOrThrow({
      where: { username },
    });
  }

  async findByEmail(email) {
    return await prisma.usuario.findUniqueOrThrow({
      where: { email },
    });
  }

  async update(id, data) {
    return await prisma.usuario.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return await prisma.usuario.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async updateLoginTimestamp(id) {
    return await prisma.usuario.update({
      where: { id },
      data: { ultimoLogin: new Date() },
    });
  }
}

export default new UsuarioModel();
