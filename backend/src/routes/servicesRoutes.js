import express from "express";
import ServicesController from "../controllers/ServicesController.js";
import { authRequired, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authRequired, adminOnly, async (req, res) => {
    try {
        res.json(await ServicesController.getAll());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", authRequired, adminOnly, async (req, res) => {
    try {
        res.status(201).json(await ServicesController.create(req.body));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/:id", authRequired, adminOnly, async (req, res) => {
    try {
        res.json(await ServicesController.update(req.params.id, req.body));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:id", authRequired, adminOnly, async (req, res) => {
    try {
        res.json(await ServicesController.delete(req.params.id));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
