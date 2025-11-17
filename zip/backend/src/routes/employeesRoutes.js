import express from "express";
import EmployeesController from "../controllers/EmployeesController.js";
import { authRequired, adminOnly } from "../middleware/authMiddleware.js"; // <== EZT ADD HOZZÁ

const router = express.Router();

/**
 * ✅ GET all employees (public)
 * Nyilvános, hogy a foglalási oldalon is betölthesse a listát.
 */
router.get("/", async (req, res) => {
    try {
        const employees = await EmployeesController.getAll();
        res.json(employees);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * 🔐 POST new employee (admin only)
 */
router.post("/", authRequired, adminOnly, async (req, res) => {
    try {
        const created = await EmployeesController.create(req.body);
        res.status(201).json(created);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * 🔐 PUT update employee (admin only)
 */
router.put("/:id", authRequired, adminOnly, async (req, res) => {
    try {
        const updated = await EmployeesController.update(req.params.id, req.body);
        res.json(updated);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * 🔐 DELETE employee (admin only)
 */
router.delete("/:id", authRequired, adminOnly, async (req, res) => {
    try {
        const deleted = await EmployeesController.delete(req.params.id);
        res.json(deleted);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
