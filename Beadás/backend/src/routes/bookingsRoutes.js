import express from "express";
import pool from "../db.js";
import BookingsController from "../controllers/BookingsController.js";
import { authRequired, adminRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

//Összes foglalás listázása (admin)
router.get("/", authRequired, async (req, res) => {
  try {
    // Csak admin férhet hozzá az összes foglaláshoz
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Csak admin férhet hozzá." });
    }

    // Foglalások lekérése az adatbázisból
    const result = await pool.query(`
    SELECT 
      b.id,
      b.start_time,
      b.end_time,
      b.status,
      u.name AS user_name,
      s.name AS service_name,
      e.name AS employee_name
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN services s ON b.service_id = s.id
    JOIN employees e ON b.employee_id = e.id
    ORDER BY b.start_time DESC;
    `);

    // Válaszban visszaadjuk a foglalásokat
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Foglalások lekérése sikertelen." });
  }
});

//Saját foglalások lekérése (bejelentkezett user) 
router.get("/my", authRequired, async (req, res) => {
  try {
    // Saját foglalások lekérése az adatbázisból
    const result = await pool.query(
      `
      SELECT 
        b.id,
        b.start_time,
        b.end_time,
        b.status,
        s.name AS service_name,
        e.name AS employee_name
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN employees e ON b.employee_id = e.id
      WHERE b.user_id = $1
      ORDER BY b.start_time DESC
      `,
      // A bejelentkezett felhasználó ID-ját használjuk a lekérdezéshez
      [req.user.id]
    );

    // Válaszban visszaadjuk a felhasználó foglalásait
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Nem sikerült lekérni a foglalásokat." });
  }
});

//3. Új foglalás létrehozása (bejelentkezett user)
router.post("/", async (req, res) => {
  try {
    console.log("[Route] POST /api/bookings hívás:", req.body);
    // Foglalás létrehozása
    const result = await BookingsController.create(req.body);
    console.log("[Route] BookingsController.create lefutott, ID:", result.id);
    // Válaszként visszaadjuk az új foglalás adatokat
    res.status(201).json(result);
  } catch (e) {
    console.error("[Route] Hiba a foglalás létrehozásakor:", e);
    // Hibakód meghatározása
    const status = e.message.includes("foglal") ? 400 : 500;
    // Hibaüzenet visszaküldése
    res.status(status).json({ error: e.message });
  }
});

//Foglalás törlése (admin vagy a saját)
router.delete("/:id", authRequired, async (req, res) => {
  const { id } = req.params;
  try {
    // Ellenőrizzük, hogy létezik-e a törlendő foglalás
    const booking = await pool.query("SELECT * FROM bookings WHERE id = $1", [id]);
    if (!booking.rows.length) return res.status(404).json({ error: "Nem található." });

    // Csak admin vagy a felhasználó saját foglalását törölheti
    if (req.user.role !== "admin" && booking.rows[0].user_id !== req.user.id)
      return res.status(403).json({ error: "Nincs jogosultság." });

    // Foglalás törlése
    await pool.query("DELETE FROM bookings WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    // Törlés hiba esetén
    res.status(500).json({ error: "Törlés sikertelen." });
  }
});

//Foglalás státuszának módosítása (admin only)
router.put("/:id/status", authRequired, adminRequired, async (req, res) => {
  try {
    const { status } = req.body;
    // Státusz frissítése
    const updated = await BookingsController.updateStatus(req.params.id, status);
    // Válaszban visszaadjuk a módosított foglalást
    res.json(updated);
  } catch (e) {
    // Hibakezelés
    res.status(400).json({ error: e.message });
  }
});


//Foglalás időpontjának módosítása
router.put("/:id/reschedule", authRequired, async (req, res) => {
  try {
    const result = await BookingsController.reschedule(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});


//Foglalás lemondása (a felhasználó saját foglalása)
router.put("/:id/cancel", authRequired, async (req, res) => {
  try {
    const result = await BookingsController.cancelOwnBooking(req.user.id, req.params.id);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

export default router;
