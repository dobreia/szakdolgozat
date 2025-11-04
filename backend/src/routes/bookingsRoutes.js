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
    const { user_id, service_id, employee_id, date } = req.body;

    // 1️⃣ Szolgáltatás időtartam lekérése
    const serviceRes = await pool.query(
      `SELECT duration_minutes FROM services WHERE id = $1`,
      [service_id]
    );
    const duration = serviceRes.rows[0]?.duration_minutes || 30; // alap: 30 perc

    // 2️⃣ Kezdés és befejezés kiszámítása
    const start_time = new Date(date);
    const end_time = new Date(start_time.getTime() + duration * 60000);

    // 3️⃣ Foglalás mentése
    const result = await pool.query(
      `INSERT INTO bookings (user_id, service_id, employee_id, start_time, end_time, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *`,
      [user_id, service_id, employee_id, start_time, end_time]
    );

    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Foglalás mentése sikertelen." });
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
