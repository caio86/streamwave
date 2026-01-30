import { Router } from "express";
import FilmeController from "../controllers/filme.controller.js";

const routes = Router();

/**
 * @swagger
 * /filmes:
 *   get:
 *     summary: Obter lista de filmes
 *     description: Retorna uma lista de todos os filmes disponíveis na plataforma.
 *     tags:
 *       - Filmes
 *     responses:
 *       200:
 *         description: Lista de filmes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Filme'
 */
routes.get("/", FilmeController.index);

/**
 * @swagger
 * /filmes:
 *   post:
 *     summary: Adicionar um novo filme
 *     description: Adiciona um novo filme à plataforma.
 *     tags:
 *       - Filmes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Filme'
 *     responses:
 *       201:
 *         description: Filme criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Filme'
 */
routes.post("/", FilmeController.create);

/**
 * @swagger
 * /filmes/{conteudoId}:
 *   get:
 *     summary: Obter detalhes de um filme
 *     description: Retorna os detalhes de um filme específico pelo seu ID.
 *     tags:
 *       - Filmes
 *     parameters:
 *       - in: path
 *         name: conteudoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do filme
 *     responses:
 *       200:
 *         description: Detalhes do filme retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Filme'
 *       404:
 *         description: Filme não encontrado
 */
routes.get("/:conteudoId", FilmeController.getByID);

/**
 * @swagger
 * /filmes/{conteudoId}:
 *   put:
 *     summary: Atualizar um filme
 *     description: Atualiza as informações de um filme existente.
 *     tags:
 *       - Filmes
 *     parameters:
 *       - in: path
 *         name: conteudoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do filme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Filme'
 *     responses:
 *       200:
 *         description: Filme atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Filme'
 *       404:
 *         description: Filme não encontrado
 */
routes.put("/:conteudoId", FilmeController.update);

/**
 * @swagger
 * /filmes/{conteudoId}:
 *   delete:
 *     summary: Deletar um filme
 *     description: Remove um filme da plataforma pelo seu ID.
 *     tags:
 *       - Filmes
 *     parameters:
 *       - in: path
 *         name: conteudoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do filme
 *     responses:
 *       204:
 *         description: Filme deletado com sucesso
 *       404:
 *         description: Filme não encontrado
 */
routes.delete("/:conteudoId", FilmeController.delete);

export default routes;
