import { Router } from "express";
import SerieController from "../controllers/serie.controller.js";
import temporadaRoutes from "./temporadas.routes.js";

/**
 * @swagger
 * /series:
 *   get:
 *     summary: Listar séries
 *     description: Retorna uma lista de séries disponíveis.
 *     tags:
 *       - Series
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de séries retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Serie'
 *
 *   post:
 *     summary: Criar série
 *     description: Cria um novo conteúdo do tipo série.
 *     tags:
 *       - Series
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Serie'
 *     responses:
 *       201:
 *         description: Série criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Serie'
 *
 * /series/{conteudoId}:
 *   get:
 *     summary: Obter série
 *     description: Retorna uma série pelo conteudoId.
 *     tags:
 *       - Series
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conteudoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID (UUID) do conteúdo da série
 *     responses:
 *       200:
 *         description: Série retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Serie'
 *
 *   put:
 *     summary: Atualizar série
 *     description: Atualiza os dados da série indicada por conteudoId.
 *     tags:
 *       - Series
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conteudoId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Serie'
 *     responses:
 *       200:
 *         description: Série atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Serie'
 *
 *   delete:
 *     summary: Excluir série
 *     description: Remove a série e seus relacionamentos (cascata).
 *     tags:
 *       - Series
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conteudoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Série excluída com sucesso
 */

const routes = Router();

routes.get("/", SerieController.index);
routes.get("/:conteudoId", SerieController.getByID);
routes.post("/", SerieController.create);
routes.put("/:conteudoId", SerieController.update);
routes.delete("/:conteudoId", SerieController.delete);

// Rotas aninhadas de temporadas
routes.use("/:conteudoId/temporadas", temporadaRoutes);

export default routes;
