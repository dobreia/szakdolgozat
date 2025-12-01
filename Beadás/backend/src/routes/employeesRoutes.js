import express from "express";
import EmployeesController from "../controllers/EmployeesController.js";
import { authRequired, adminRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

// Összes alkalmazott lekérése
router.get("/", authRequired, async (req, res) => {
    try {
        const employees = await EmployeesController.getAll();
        // Az alkalmazottak listájának visszaadása
        res.json(employees);
    } catch (err) {
        console.error("EMPLOYEE GET ERROR:", err);
        // Hibaüzenet válasz visszaadása
        res.status(err.status || 500).json({ error: err.message });
    }
});

// Új alkalmazott felvétele (admin jogosultság szükséges)
router.post("/", authRequired, adminRequired, async (req, res) => {
    try {
        const employee = await EmployeesController.create(req.body);
        res.status(201).json(employee);
    } catch (err) {
        console.warn("EMPLOYEE CREATE ERROR:", err.message);
        res.status(err.status || 500).json({ error: err.message });
    }
});

// Alkalmazott módosítása (admin jogosultság szükséges)
router.put("/:id", authRequired, adminRequired, async (req, res) => {
    try {
        const employee = await EmployeesController.update(req.params.id, req.body);
        res.json(employee);
    } catch (err) {
        console.warn("EMPLOYEE UPDATE ERROR:", err.message);
        res.status(err.status || 500).json({ error: err.message });
    }
});

// Alkalmazott törlése (admin jogosultság szükséges)
router.delete("/:id", authRequired, adminRequired, async (req, res) => {
    try {
        const response = await EmployeesController.delete(req.params.id);
        res.json(response);
    } catch (err) {
        console.error("EMPLOYEE DELETE ERROR:", err.message);
        res.status(err.status || 500).json({ error: err.message });
    }
});

export default router;
