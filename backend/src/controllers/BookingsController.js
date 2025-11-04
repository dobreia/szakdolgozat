import pool from "../db.js";

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
        // 1️⃣ Lekérjük a szolgáltatás időtartamát
        const serviceRes = await pool.query(
            "SELECT duration_minutes FROM services WHERE id = $1",
            [service_id]
        );
        if (serviceRes.rowCount === 0) throw new Error("Nincs ilyen szolgáltatás");
        const duration = serviceRes.rows[0].duration_minutes;

        // 2️⃣ Kiszámoljuk az end_time-ot
        const start = new Date(start_time);
        const end = new Date(start.getTime() + duration * 60 * 1000);

        // 3️⃣ Ellenőrizzük, hogy a dolgozó szabad-e
        const conflict = await pool.query(
            `SELECT 1 FROM bookings
            WHERE employee_id = $1
            AND status != 'cancelled'
            AND NOT ($3 <= start_time OR $2 >= end_time)`,
            [employee_id, start, end]
        );
        if (conflict.rows.length > 0) {
            throw new Error("Ez az időpont már foglalt ennél a dolgozónál!");
        }

        // 4️⃣ Új foglalás beszúrása
        const result = await pool.query(
            `INSERT INTO bookings (user_id, service_id, employee_id, start_time, end_time, status)
            VALUES ($1, $2, $3, $4, $5, 'pending')
            RETURNING *`,
            [user_id, service_id, employee_id, start, end]
        );

        return result.rows[0];
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
