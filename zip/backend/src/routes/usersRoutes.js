import express from "express";
import UsersController from "../controllers/UsersController.js";

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
    try {
        res.json(await UsersController.getAll());
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// POST new user
router.post("/", async (req, res) => {
    try {
        res.status(201).json(await UsersController.create(req.body));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// PUT update user role
router.put("/:id", async (req, res) => {
    try {
        res.json(await UsersController.updateRole(req.params.id, req.body));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// DELETE user
router.delete("/:id", async (req, res) => {
    try {
        res.json(await UsersController.delete(req.params.id));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
