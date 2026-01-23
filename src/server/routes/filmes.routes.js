import { Router } from "express"
import Filme from "../models/Filme.js"

const routes = Router()

// List filmes
routes.get("/", async (req, res) => {
  try {
    const filmes = await Filme.findAll()
    res.json(filmes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get filme by conteudoId
routes.get("/:conteudoId", async (req, res) => {
  try {
    const { conteudoId } = req.params
    const filme = await Filme.findById(conteudoId)
    if (!filme) return res.status(404).json({ error: "Filme not found" })
    res.json(filme)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Create filme
// Accepts either:
// { conteudoId: "...", duracaoTotal: 120 }
// or nested conteudo create:
// { duracaoTotal: 120, conteudo: { titulo: "...", tipo: "FILME", ... } }
routes.post("/", async (req, res) => {
  try {
    const data = req.body
    const created = await Filme.create(data)
    res.status(201).json(created)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Update filme by conteudoId
routes.put("/:conteudoId", async (req, res) => {
  try {
    const { conteudoId } = req.params
    const data = req.body
    const updated = await Filme.update(conteudoId, data)
    res.json(updated)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Delete filme by conteudoId
routes.delete("/:conteudoId", async (req, res) => {
  try {
    const { conteudoId } = req.params
    await Filme.delete(conteudoId)
    res.status(204).end()
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default routes;
