import { Router } from "express";
import EpisodioController from "../controllers/episodios.controller.js";

/**
 * @swagger
 * /series/{serieId}/temporadas/{temporadaId}/episodios:
 *   get:
 *     summary: Listar episódios de uma temporada
 *     description: Retorna a lista de episódios pertencentes a uma temporada específica.
 *     tags:
 *       - Episodios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serieId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID (UUID) do conteúdo da série
 *       - in: path
 *         name: temporadaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da temporada
 *     responses:
 *       200:
 *         description: Lista de episódios retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Episodio'
 *
 *   post:
 *     summary: Criar um episódio
 *     description: Cria um novo episódio para a temporada especificada.
 *     tags:
 *       - Episodios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serieId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: temporadaId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Episodio'
 *     responses:
 *       201:
 *         description: Episódio criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Episodio'
 *
 * /series/{serieId}/temporadas/{temporadaId}/episodios/{episodioId}:
 *   get:
 *     summary: Obter episódio
 *     description: Retorna os dados de um episódio específico.
 *     tags:
 *       - Episodios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serieId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: temporadaId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: episodioId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Episódio retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Episodio'
 *
 *   put:
 *     summary: Atualizar episódio
 *     description: Atualiza os dados de um episódio existente.
 *     tags:
 *       - Episodios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serieId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: temporadaId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: episodioId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Episodio'
 *     responses:
 *       200:
 *         description: Episódio atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Episodio'
 *
 *   delete:
 *     summary: Excluir episódio
 *     description: Remove um episódio da temporada.
 *     tags:
 *       - Episodios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serieId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: temporadaId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: episodioId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Episódio excluído com sucesso
 */

const routes = Router({ mergeParams: true });

routes.get("/", EpisodioController.index);
routes.get("/:episodioId", EpisodioController.getByID);
routes.post("/", EpisodioController.create);
routes.put("/:episodioId", EpisodioController.update);
routes.delete("/:episodioId", EpisodioController.delete);

export default routes;
