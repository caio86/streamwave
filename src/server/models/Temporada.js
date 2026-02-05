import { prisma } from "../prisma/prisma.js";

class TemporadaModel {
  async create(data) {
    return await prisma.temporada.create({
      data,
    });
  }

  async findAllBySerie(serieId) {
    return await prisma.temporada.findMany({
      where: { serieId },
      include: {
        episodios: true,
      },
      orderBy: { numero: "asc" },
    });
  }

  async findById(id) {
    const temporadaId = Number(id);
    return await prisma.temporada.findUniqueOrThrow({
      where: { id: temporadaId },
      include: {
        episodios: true,
        serie: true,
      },
    });
  }

  async update(id, data) {
    const temporadaId = Number(id);
    return await prisma.temporada.update({
      where: { id: temporadaId },
      data,
    });
  }

  async delete(id) {
    const temporadaId = Number(id);
    return await prisma.temporada.delete({
      where: { id: temporadaId },
    });
  }
}

export default new TemporadaModel();
