import { prisma } from "../prisma/prisma.js";

class EpisodioModel {
  async create(data) {
    return await prisma.episodio.create({
      data,
    });
  }

  async findAllByTemporada(temporadaId) {
    const id = Number(temporadaId);
    return await prisma.episodio.findMany({
      where: { temporadaId: id },
      orderBy: { numeroEpisodio: "asc" },
    });
  }

  async findById(id) {
    const episodioId = Number(id);
    return await prisma.episodio.findUniqueOrThrow({
      where: { id: episodioId },
    });
  }

  async update(id, data) {
    const episodioId = Number(id);
    return await prisma.episodio.update({
      where: { id: episodioId },
      data,
    });
  }

  async delete(id) {
    const episodioId = Number(id);
    return await prisma.episodio.delete({
      where: { id: episodioId },
    });
  }
}

export default new EpisodioModel();
