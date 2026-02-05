import { Router } from "express";
import FilmeController from "../controllers/filme.controller.js";
import multer from "multer";
import AppError, { STATUS_CODE } from "../utils/appError.js";

const routes = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(
        new AppError("Only video files are allowed!", STATUS_CODE.BAD_REQUEST),
        false
      );
    }
  },
});

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

/**
 * @swagger
 * /filmes/{conteudoId}/upload:
 *   post:
 *     summary: Envia um arquivo de vídeo para um filme
 *     description: Faz o upload de um arquivo de vídeo associado a um filme específico.
 *     tags: [Filmes]
 *     parameters:
 *       - in: path
 *         name: conteudoId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do filme
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de vídeo a ser enviado
 *     responses:
 *       200:
 *         description: Arquivo enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Filme'
 *       400:
 *         description: Requisição inválida
 *       404:
 *         description: Filme não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routes.post(
  "/:conteudoId/upload",
  upload.single("video"),
  FilmeController.uploadFile
);

export default routes;
