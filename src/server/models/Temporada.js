import { prisma } from "../prisma/prisma.js";

class TemporadaModel {
  async create(data) {
    return await prisma.temporada.create({
      data,
    });
  }

  async findById(id) {
    return await prisma.temporada.findUniqueOrThrow({
      where: { id },
      include: {
        episodios: true,
        serie: true,
      },
    });
  }

  async update(id, data) {
    return await prisma.temporada.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return await prisma.temporada.delete({
      where: { id },
    });
  }

  async findAllBySerie(id) {
    return await prisma.temporada.findMany({
      where: { serieId: id },
      include: {
        episodios: true,
      },
    });
  }
}

export default new TemporadaModel();
