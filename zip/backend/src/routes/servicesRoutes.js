import express from "express";
import ServicesController from "../controllers/ServicesController.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        res.json(await ServicesController.getAll());
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post("/", async (req, res) => {
    try {
        res.status(201).json(await ServicesController.create(req.body));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        res.json(await ServicesController.update(req.params.id, req.body));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        res.json(await ServicesController.delete(req.params.id));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
