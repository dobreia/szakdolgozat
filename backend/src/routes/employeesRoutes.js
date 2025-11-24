import express from "express";
import EmployeesController from "../controllers/EmployeesController.js";
import { authRequired, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Csak admin kérheti le az alkalmazottakat
router.get("/", authRequired, adminOnly, async (req, res) => {
    try {
        res.json(await EmployeesController.getAll());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", authRequired, adminOnly, async (req, res) => {
    try {
        res.status(201).json(await EmployeesController.create(req.body));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/:id", authRequired, adminOnly, async (req, res) => {
    try {
        res.json(await EmployeesController.update(req.params.id, req.body));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:id", authRequired, adminOnly, async (req, res) => {
    try {
        res.json(await EmployeesController.delete(req.params.id));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
