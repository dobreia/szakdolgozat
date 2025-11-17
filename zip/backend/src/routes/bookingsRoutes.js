import express from "express";
import pool from "../db.js";
import BookingsController from "../controllers/BookingsController.js";
import { authRequired, adminOnly } from "../middleware/authMiddleware.js"

const router = express.Router();

/**
 * 📌 1. Összes foglalás listázása (admin)
 */
router.get("/", authRequired, async (req, res) => {
  try {
    // csak admin láthatja az összeset
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Csak admin férhet hozzá." });
    }

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

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Foglalások lekérése sikertelen." });
  }
});

/**
 * 📌 2. Saját foglalások lekérése (bejelentkezett user)
 */
router.get("/my", authRequired, async (req, res) => {
  try {
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
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Nem sikerült lekérni a foglalásokat." });
  }
});


/**
 * 📌 3. Új foglalás létrehozása (bejelentkezett user)
 */
router.post("/", async (req, res) => {
  try {
    console.log("📥 [Route] POST /api/bookings hívás:", req.body);
    const result = await BookingsController.create(req.body);
    console.log("✅ [Route] BookingsController.create lefutott, ID:", result.id);
    res.status(201).json(result);
  } catch (e) {
    console.error("💥 [Route] Hiba a foglalás létrehozásakor:", e);
    const status = e.message.includes("foglal") ? 400 : 500;
    res.status(status).json({ error: e.message });
  }
});


/**
 * 📌 4. Foglalás törlése (admin vagy a saját)
 */
router.delete("/:id", authRequired, async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await pool.query("SELECT * FROM bookings WHERE id = $1", [id]);
    if (!booking.rows.length) return res.status(404).json({ error: "Nem található." });

    if (req.user.role !== "admin" && booking.rows[0].user_id !== req.user.id)
      return res.status(403).json({ error: "Nincs jogosultság." });

    await pool.query("DELETE FROM bookings WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Törlés sikertelen." });
  }
});

router.put("/:id/status", authRequired, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await BookingsController.updateStatus(req.params.id, status);
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
