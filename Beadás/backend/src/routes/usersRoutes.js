import express from "express";
import UsersController from "../controllers/UsersController.js";
import { authRequired, adminRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

// Csak bejelentkezett felhasználó férhet hozzá a végponthoz (auth middleware)
router.use(authRequired);

// Csak admin hozzáférés a többi végponthoz
router.use(adminRequired);

// GET - Összes felhasználó lekérése
router.get("/", async (req, res) => {
    try {
        // Felhasználók lekérése
        const users = await UsersController.getAll();
        // Válaszban visszaadjuk a felhasználók listáját
        res.json(users);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Hiba történt a felhasználók lekérése során." }); // Hibaüzenet, ha a lekérés nem sikerült
    }
});

// POST - Új felhasználó létrehozása
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

// PUT - Felhasználó szerepkörének módosítása
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

// DELETE - Felhasználó törlése
router.delete("/:id", async (req, res) => {
    try {
        const result = await UsersController.delete(req.params.id, req.user.id);
        res.json(result);
    } catch (e) {
        console.error(e);
        const status = e.status || 500;
        res.status(status).json({ error: e.message || "Hiba történt a törlés során." });
    }
});

export default router;
