import pool from "../db.js";
import { sendMail } from "../lib/mail.js";

export default class BookingsController {
    static async getAll() {
        const query = `
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
        `;
        const result = await pool.query(query);
        return result.rows;
    }




    static async create({ user_id, service_id, employee_id, start_time }) {
        console.log("📩 [BookingsController.create] meghívva paraméterekkel:", {
            user_id,
            service_id,
            employee_id,
            start_time,
        });

        try {
            // 1️⃣ Szolgáltatás lekérdezése
            const serviceRes = await pool.query(
                "SELECT name, duration_minutes FROM services WHERE id = $1",
                [service_id]
            );
            console.log("🧾 Lekért szolgáltatás:", serviceRes.rows);

            if (serviceRes.rowCount === 0) throw new Error("Nincs ilyen szolgáltatás");
            const { name: service_name, duration_minutes: duration } = serviceRes.rows[0];

            // 2️⃣ Időtartam kiszámítása
            const start = new Date(start_time);
            const end = new Date(start.getTime() + duration * 60 * 1000);
            console.log("🕒 Számított időpontok:", { start, end });

            // 3️⃣ Ütközés ellenőrzése
            const conflict = await pool.query(
                `SELECT 1 FROM bookings
             WHERE employee_id = $1
             AND status != 'cancelled'
             AND NOT ($3 <= start_time OR $2 >= end_time)`,
                [employee_id, start, end]
            );
            console.log("⚖️ Foglalási ütközés:", conflict.rows.length);

            if (conflict.rows.length > 0) {
                console.warn("🚫 Időpont ütközik, dobunk hibát");
                throw new Error("Ez az időpont már foglalt ennél a dolgozónál!");
            }

            // 4️⃣ Beszúrás
            const result = await pool.query(
                `INSERT INTO bookings (user_id, service_id, employee_id, start_time, end_time, status)
             VALUES ($1, $2, $3, $4, $5, 'pending')
             RETURNING *`,
                [user_id, service_id, employee_id, start, end]
            );
            console.log("✅ Foglalás beszúrva, ID:", result.rows[0].id);

            // 5️⃣ Email értesítés
            console.log("📨 Email küldés indul...");
            try {
                const userRes = await pool.query(
                    "SELECT name, email FROM users WHERE id = $1",
                    [user_id]
                );
                const employeeRes = await pool.query(
                    "SELECT name FROM employees WHERE id = $1",
                    [employee_id]
                );

                console.log("👤 User:", userRes.rows[0]);
                console.log("💇‍♀️ Dolgozó:", employeeRes.rows[0]);

                const user = userRes.rows[0];
                const employee = employeeRes.rows[0];

                // 🔹 Ügyfélnek
                console.log("📤 Email küldése ügyfélnek:", user.email);
                await sendMail(
                    user.email,
                    "Foglalás rögzítve - Varázs Szépségszalon",
                    `
                <h2>Kedves ${user.name}!</h2>
                <p>Köszönjük, hogy minket választottál!</p>
                <ul>
                  <li>Szolgáltatás: <b>${service_name}</b></li>
                  <li>Munkatárs: <b>${employee.name}</b></li>
                  <li>Kezdés: <b>${start.toLocaleString("hu-HU")}</b></li>
                  <li>Befejezés: <b>${end.toLocaleString("hu-HU")}</b></li>
                </ul>
                <p>Státusz: <b>Feldolgozás alatt</b></p>
                `
                );

                // 🔹 Adminnak
                console.log("📤 Email küldése adminnak:", process.env.MAIL_USER);
                await sendMail(
                    process.env.MAIL_USER,
                    "Új foglalás érkezett",
                    `
                <p>Új foglalás érkezett:</p>
                <ul>
                  <li>Név: <b>${user.name}</b></li>
                  <li>Email: ${user.email}</li>
                  <li>Szolgáltatás: ${service_name}</li>
                  <li>Munkatárs: ${employee.name}</li>
                  <li>Kezdés: ${start.toLocaleString("hu-HU")}</li>
                </ul>
                `
                );
                console.log("✅ Email küldések befejezve");
            } catch (mailErr) {
                console.error("❌ Email küldés közben hiba:", mailErr);
            }

            return result.rows[0];
        } catch (err) {
            console.error("💥 [BookingsController.create] Hiba:", err);
            throw err;
        }
    }

    static async delete(id) {
        await pool.query("DELETE FROM bookings WHERE id=$1", [id]);
        return { message: "Foglalás törölve" };
    }

    static async updateStatus(id, status) {
        const validStatuses = ["pending", "confirmed", "cancelled"];
        if (!validStatuses.includes(status)) {
            throw new Error("Érvénytelen státusz");
        }

        const result = await pool.query(
            `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
            [status, id]
        );
        return result.rows[0];
    }
}
