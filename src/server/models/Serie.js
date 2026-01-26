import { prisma } from "../prisma/prisma.js";

class SerieModel {
  async create(data) {
    return await prisma.serie.create({
      data,
      include: { conteudo: true }
    });
  }

  async findById(conteudoId) {
    return await prisma.serie.findUniqueOrThrow({
      where: { conteudoId },
      include: {
        conteudo: true,
        temporadas: {
          include: { episodios: true, },
        },
      },
    });
  }

  async findAll(where = {}) {
    return await prisma.serie.findMany({
      where,
      include: { conteudo: true },
    });
  }

  async update(conteudoId, data) {
    return await prisma.serie.update({
      where: { conteudoId },
      data,
      include: { conteudo: true }
    });
  }

  async delete(conteudoId) {
    return await prisma.conteudo.delete({
      where: { conteudoId },
    });
  }
}

export default new SerieModel();