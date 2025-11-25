// routes/users.js
import express from "express";
import UsersController from "../controllers/UsersController.js";
import { authRequired, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// csak bejelentkezett user → auth
router.use(authRequired);

// csak admin kezelheti a /users végpontokat
function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ error: "Nincs admin jogosultság." });
    }
    next();
}

router.use(adminOnly);

// GET all users
router.get("/", async (req, res) => {
    try {
        const users = await UsersController.getAll();
        res.json(users);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Hiba történt a felhasználók lekérése során." });
    }
});

// POST new user
router.post("/", async (req, res) => {
    try {
        const created = await UsersController.create(req.body);
        res.status(201).json(created);
    } catch (e) {
        console.error(e);
        const status = e.status || 500;
        res.status(status).json({ error: e.message || "Hiba történt a létrehozás során." });
    }
});

// PUT update user role
router.put("/:id", async (req, res) => {
    try {
        const updated = await UsersController.updateRole(req.params.id, req.body);
        res.json(updated);
    } catch (e) {
        console.error(e);
        const status = e.status || 500;
        res.status(status).json({ error: e.message || "Hiba történt a módosítás során." });
    }
});

// DELETE user
router.delete("/:id", async (req, res) => {
    try {
        const result = await UsersController.delete(req.params.id);
        res.json(result);
    } catch (e) {
        console.error(e);
        const status = e.status || 500;
        res.status(status).json({ error: e.message || "Hiba történt a törlés során." });
    }
});

export default router;
