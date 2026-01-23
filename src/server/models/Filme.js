import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

class FilmeModel {
  async create(data) {
    return prisma.filme.create({ data });
  }

  async findById(conteudoId) {
    return prisma.filme.findUnique({
      where: { conteudoId },
      include: { conteudo: true },
    });
  }

  async findAll(where = {}) {
    return prisma.filme.findMany({
      where,
      include: { conteudo: true },
    });
  }

  async update(conteudoId, data) {
    return prisma.filme.update({
      where: { conteudoId },
      data,
    });
  }

  async delete(conteudoId) {
    return prisma.filme.delete({
      where: { conteudoId },
    });
  }
}

export default new FilmeModel();
