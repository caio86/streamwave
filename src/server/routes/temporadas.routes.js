/**
 * @swagger
 * /series/{serieId}/temporadas:
 *   get:
 *     summary: Listar temporadas de uma série
 *     description: Retorna as temporadas pertencentes a uma série.
 *     tags:
 *       - Temporadas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serieId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID (UUID) do conteúdo da série
 *     responses:
 *       200:
 *         description: Lista de temporadas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Temporada'
 *
 *   post:
 *     summary: Criar temporada
 *     description: Cria uma nova temporada vinculada à série informada.
 *     tags:
 *       - Temporadas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serieId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Temporada'
 *     responses:
 *       201:
 *         description: Temporada criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Temporada'
 *
 * /series/{serieId}/temporadas/{temporadaId}:
 *   get:
 *     summary: Obter temporada
 *     description: Retorna os dados de uma temporada específica.
 *     tags:
 *       - Temporadas
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
 *     responses:
 *       200:
 *         description: Temporada retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Temporada'
 *
 *   put:
 *     summary: Atualizar temporada
 *     description: Atualiza os dados de uma temporada existente.
 *     tags:
 *       - Temporadas
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
 *             $ref: '#/components/schemas/Temporada'
 *     responses:
 *       200:
 *         description: Temporada atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Temporada'
 *
 *   delete:
 *     summary: Excluir temporada
 *     description: Remove uma temporada e seus episódios (cascata).
 *     tags:
 *       - Temporadas
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
 *     responses:
 *       204:
 *         description: Temporada excluída com sucesso
 */
import { Router } from "express";
import TemporadaController from "../controllers/temporada.controller.js";
import episodiosRoutes from "./episodios.routes.js";

const routes = Router({ mergeParams: true });

routes.get("/", TemporadaController.index);
routes.get("/:temporadaId", TemporadaController.getByID);
routes.post("/", TemporadaController.create);
routes.put("/:temporadaId", TemporadaController.update);
routes.delete("/:temporadaId", TemporadaController.delete);

// Roteamento aninhado para episódios
routes.use("/:temporadaId/episodios", episodiosRoutes);

export default routes;
