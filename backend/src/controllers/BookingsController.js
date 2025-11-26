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
        console.log("📩 [BookingsController.create] paraméterek:", {
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

            if (serviceRes.rowCount === 0) {
                const err = new Error("Nincs ilyen szolgáltatás");
                err.status = 400;
                throw err;
            }

            const { name: service_name, duration_minutes: duration } = serviceRes.rows[0];

            // 2️⃣ Időpontok helyes kezelése — nincs timezone konverzió!
            const start = new Date(`${start_time}:00`); // 🔥 lokális értelmezés
            const end = new Date(start.getTime() + duration * 60000);

            console.log("🕒 Számított időpontok:", { start, end });

            // 3️⃣ Ütközés ellenőrzése
            const conflict = await pool.query(
                `SELECT 1 FROM bookings
            WHERE employee_id = $1
            AND status IN ('pending', 'confirmed')
            AND NOT ($3 <= start_time OR $2 >= end_time)`,
                [employee_id, start, end]
            );

            if (conflict.rowCount > 0) {
                const err = new Error("Ez az időpont már foglalt ennél a dolgozónál!");
                err.status = 409;
                throw err;
            }

            // 4️⃣ Beszúrás
            const insertRes = await pool.query(
                `INSERT INTO bookings
            (user_id, service_id, employee_id, start_time, end_time, status)
            VALUES ($1, $2, $3, $4, $5, 'pending')
            RETURNING *`,
                [user_id, service_id, employee_id, start, end]
            );

            const booking = insertRes.rows[0];
            console.log("✅ Foglalás létrehozva ID:", booking.id);

            // 5️⃣ Email küldés (ha nem fontos, kommentelhető)
            try {
                const userRes = await pool.query(
                    "SELECT name, email FROM users WHERE id = $1",
                    [user_id]
                );
                const employeeRes = await pool.query(
                    "SELECT name FROM employees WHERE id = $1",
                    [employee_id]
                );

                const user = userRes.rows[0];
                const employee = employeeRes.rows[0];

                await sendMail(
                    user.email,
                    "Foglalás rögzítve",
                    `<p>Kedves ${user.name}! A foglalásod rögzítettük.</p>`
                );
                await sendMail(
                    process.env.MAIL_USER,
                    "Új foglalás érkezett",
                    `<p>Új foglalás ${user.name} által.</p>`
                );
            } catch (emailErr) {
                console.error("📧 Email küldés hiba:", emailErr);
            }

            return booking;

        } catch (err) {
            console.error("💥 Foglalás létrehozása sikertelen:", err);
            if (!err.status) err.status = 500;
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
