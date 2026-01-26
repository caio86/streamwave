import { prisma } from "../prisma/prisma.js";

class EpisodioModel {
  async create(data) {
    return await prisma.episodio.create({
      data,
    });
  }

  async findById(id) {
    return await prisma.episodio.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id, data) {
    return await prisma.episodio.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return await prisma.episodio.delete({
      where: { id },
    });
  }
}

export default new EpisodioModel();