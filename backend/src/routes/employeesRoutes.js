import express from "express";
import EmployeesController from "../controllers/EmployeesController.js";
import { authRequired, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Csak admin kérheti le az alkalmazottakat
router.get("/", authRequired, adminOnly, async (req, res) => {
    try {
        const employees = await EmployeesController.getAll();
        res.json(employees);
    } catch (err) {
        console.error("EMPLOYEE GET ERROR:", err);
        res.status(err.status || 500).json({ error: err.message });
    }
});

router.post("/", authRequired, adminOnly, async (req, res) => {
    try {
        const employee = await EmployeesController.create(req.body);
        res.status(201).json(employee);
    } catch (err) {
        console.warn("EMPLOYEE CREATE ERROR:", err.message);
        res.status(err.status || 500).json({ error: err.message });
    }
});

router.put("/:id", authRequired, adminOnly, async (req, res) => {
    try {
        const employee = await EmployeesController.update(req.params.id, req.body);
        res.json(employee);
    } catch (err) {
        console.warn("EMPLOYEE UPDATE ERROR:", err.message);
        res.status(err.status || 500).json({ error: err.message });
    }
});

router.delete("/:id", authRequired, adminOnly, async (req, res) => {
    try {
        const response = await EmployeesController.delete(req.params.id);
        res.json(response);
    } catch (err) {
        console.error("EMPLOYEE DELETE ERROR:", err.message);
        res.status(err.status || 500).json({ error: err.message });
    }
});

export default router;
