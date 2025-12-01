import express from "express";
import ServicesController from "../controllers/ServicesController.js";
const router = express.Router();

// GET - szolgáltatások listája (admin)
router.get("/", async (req, res) => {
    try {
        // Admin számára elérhető szolgáltatások lekérése
        const services = await ServicesController.getAllAdmin();
        // A szolgáltatások visszaadása válaszként
        res.json(services);
    } catch (err) {
        console.error(err);
        // Hibaüzenet, ha a lekérés nem sikerül
        res.status(500).json({ error: "Hiba történt a szolgáltatások lekérésekor." });
    }
});

// GET - publikus szolgáltatások listája
router.get("/public", async (req, res) => {
    try {
        const services = await ServicesController.getAllPublic();
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: "Hiba történt a szolgáltatások lekérésekor." });
    }
});

// POST - új szolgáltatás hozzáadása
router.post("/", async (req, res) => {
    const data = await ServicesController.create(req.body);

    if (data.error) {
        return res.status(data.status).json({ message: data.error });
    }

    res.status(201).json(data);
});

// PUT - meglévő szolgáltatás frissítése
router.put("/:id", async (req, res) => {
    const data = await ServicesController.update(req.params.id, req.body);

    if (data.error) {
        return res.status(data.status).json({ message: data.error });
    }

    res.json(data);
});

// DELETE - szolgáltatás törlése
router.delete("/:id", async (req, res) => {
    const data = await ServicesController.delete(req.params.id);

    if (data.error) {
        return res.status(data.status).json({ message: data.error });
    }

    res.json(data);
});

export default router;
