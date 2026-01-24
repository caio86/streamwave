import { prisma } from "../prisma/prisma.js";

class FilmeModel {
  async create(data) {
    return await prisma.filme.create({ data });
  }

  async findById(conteudoId) {
    return await prisma.filme.findUniqueOrThrow({
      where: { conteudoId },
      include: { conteudo: true },
    });
  }

  async findAll(where = {}) {
    return await prisma.filme.findMany({
      where,
      include: { conteudo: true },
    });
  }

  async update(conteudoId, data) {
    return await prisma.filme.update({
      where: { conteudoId },
      data,
    });
  }

  async delete(conteudoId) {
    return await prisma.conteudo.delete({
      where: { conteudoId },
    });
  }
}

export default new FilmeModel();
