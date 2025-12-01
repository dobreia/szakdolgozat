import pool from "../db.js";
import { sendMail } from "../lib/mail.js";
import {
    bookingCreatedTemplate,
    newBookingNotificationTemplate,
    bookingRejectedTemplate,
    bookingApprovedTemplate
} from "../lib/mailTemplates.js";

export default class BookingsController {

    // Szolgáltatások lekérése
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

    // Új foglalás létrehozása
    static async create({ user_id, service_id, employee_id, start_time }) {
        console.log("📩 [BookingsController.create] paraméterek:", {
            user_id,
            service_id,
            employee_id,
            start_time,
        });

        try {
            // Kötelező mezők ellenőrzése
            if (!user_id) {
                const err = new Error("Nincs kiválasztva ügyfél!");
                err.status = 400;
                throw err;
            }

            if (!employee_id) {
                const err = new Error("Nincs kiválasztva dolgozó!");
                err.status = 400;
                throw err;
            }

            if (!service_id) {
                const err = new Error("Nincs kiválasztva szolgáltatás!");
                err.status = 400;
                throw err;
            }

            if (!start_time) {
                const err = new Error("A kezdési időpont megadása kötelező!");
                err.status = 400;
                throw err;
            }

            // Dátum validáció
            const start = new Date(`${start_time}:00`);

            if (isNaN(start.getTime())) {
                const err = new Error("Érvénytelen dátum!");
                err.status = 400;
                throw err;
            }

            if (start < new Date()) {
                const err = new Error("Múltbeli időpontra nem lehet foglalni!");
                err.status = 400;
                throw err;
            }

            // Szolgáltatás ellenőrzése
            const serviceRes = await pool.query(
                "SELECT name, duration_minutes, active FROM services WHERE id = $1",
                [service_id]
            );

            if (!serviceRes.rowCount || !serviceRes.rows[0].active) {
                const err = new Error("A szolgáltatás nem elérhető vagy inaktív!");
                err.status = 400;
                throw err;
            }

            const duration = serviceRes.rows[0].duration_minutes;
            const end = new Date(start.getTime() + duration * 60000);

            // Ütközés ellenőrzés
            const conflict = await pool.query(
                `
                SELECT 1 FROM bookings
                WHERE employee_id = $1
                AND status IN ('pending', 'confirmed')
                AND NOT ($3 <= start_time OR $2 >= end_time)
                `,
                [employee_id, start, end]
            );

            if (conflict.rowCount > 0) {
                const err = new Error("Ez az időpont már foglalt ennél a dolgozónál!");
                err.status = 409;
                throw err;
            }

            // Új foglalás beszúrása az adatbázisba 
            const insertRes = await pool.query(
                `
                INSERT INTO bookings
                (user_id, service_id, employee_id, start_time, end_time, status)
                VALUES ($1, $2, $3, $4, $5, 'pending')
                RETURNING *
                `,
                [user_id, service_id, employee_id, start, end]
            );

            const booking = insertRes.rows[0];

            // Email küldés async módon
            (async () => {
                try {
                    const userRes = await pool.query(
                        "SELECT name, email FROM users WHERE id = $1",
                        [user_id]
                    );
                    const user = userRes.rows[0];

                    const employeeRes = await pool.query(
                        "SELECT name FROM employees WHERE id = $1",
                        [employee_id]
                    );
                    const employee = employeeRes.rows[0];

                    // Ügyfél email
                    await sendMail(
                        user.email,
                        "Foglalás rögzítve ✔",
                        bookingCreatedTemplate({
                            name: user.name,
                            serviceName: serviceRes.rows[0].name,
                            employeeName: employee.name,
                            start: start.toLocaleString("hu-HU"),
                            end: end.toLocaleString("hu-HU"),
                        })
                    );

                    // Szalonnak email
                    await sendMail(
                        process.env.MAIL_USER,
                        "Új foglalás érkezett 📬",
                        newBookingNotificationTemplate({
                            userName: user.name,
                            userEmail: user.email,
                            serviceName: serviceRes.rows[0].name,
                            employeeName: employee.name,
                            start: start.toLocaleString("hu-HU"),
                            end: end.toLocaleString("hu-HU")
                        })
                    );

                } catch (emailErr) {
                    console.error("📧 Email küldés hiba (nem kritikus):", emailErr);
                }
            })();

            return booking;

        } catch (err) {
            console.error("Foglalás létrehozása sikertelen:", err);
            if (!err.status) err.status = 500;
            throw err;
        }
    }

    // Foglalás törlése
    static async delete(id) {
        await pool.query("DELETE FROM bookings WHERE id=$1", [id]);
        return { message: "Foglalás törölve" };
    }

    // Foglalás státuszának frissítése
    static async updateStatus(id, status) {
        const validStatuses = ["pending", "confirmed", "cancelled"];
        if (!validStatuses.includes(status)) {
            throw new Error("Érvénytelen státusz");
        }

        const result = await pool.query(
            `
            UPDATE bookings
            SET status = $1
            WHERE id = $2
            RETURNING *
            `,
            [status, id]
        );

        if (!result.rowCount) {
            throw new Error("Foglalás nem található");
        }

        const booking = result.rows[0];

        // Kapcsolt adatok lekérése
        const details = await pool.query(`
            SELECT 
                u.name AS user_name, u.email,
                s.name AS service_name,
                e.name AS employee_name
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN services s ON b.service_id = s.id
            JOIN employees e ON b.employee_id = e.id
            WHERE b.id = $1
        `, [id]);

        const d = details.rows[0];
        const start = new Date(booking.start_time).toLocaleString("hu-HU");
        const end = new Date(booking.end_time).toLocaleString("hu-HU");

        // Email küldés async módon
        (async () => {
            try {
                if (status === "confirmed") {
                    await sendMail(
                        d.email,
                        "Foglalás jóváhagyva ✔",
                        bookingApprovedTemplate({
                            name: d.user_name,
                            serviceName: d.service_name,
                            employeeName: d.employee_name,
                            start,
                            end
                        })
                    );
                } else if (status === "cancelled") {
                    await sendMail(
                        d.email,
                        "Foglalás elutasítva ❌",
                        bookingRejectedTemplate({
                            name: d.user_name,
                            serviceName: d.service_name,
                            employeeName: d.employee_name,
                            start
                        })
                    );
                }
            } catch (err) {
                console.error("Email küldés hiba (nem kritikus):", err.message);
            }
        })();

        return booking;
    }

    // Foglalás időpontjának módosítása
    static async reschedule(id, { start_time }) {

        // Időpont validáció
        if (!start_time) {
            const err = new Error("Az új időpont megadása kötelező!");
            err.status = 400;
            throw err;
        }

        const start = new Date(`${start_time}:00`);
        if (isNaN(start.getTime())) {
            const err = new Error("Érvénytelen dátum!");
            err.status = 400;
            throw err;
        }
        if (start < new Date()) {
            const err = new Error("Múltbeli időpont nem választható!");
            err.status = 400;
            throw err;
        }

        // Kapcsolt adatok lekérése
        const bookingRes = await pool.query(
            "SELECT user_id, service_id, employee_id FROM bookings WHERE id = $1",
            [id]
        );
        if (!bookingRes.rowCount) {
            const err = new Error("Foglalás nem található!");
            err.status = 404;
            throw err;
        }

        const { user_id, service_id, employee_id } = bookingRes.rows[0];

        // Időtartam lekérés a szolgáltatás alapján
        const serviceRes = await pool.query(
            "SELECT duration_minutes FROM services WHERE id = $1",
            [service_id]
        );
        const duration = serviceRes.rows[0].duration_minutes;
        const end = new Date(start.getTime() + duration * 60000);

        // Ütközés-ellenőrzés
        const conflict = await pool.query(
            `
            SELECT 1 FROM bookings
            WHERE employee_id=$1
            AND id != $2
            AND status IN ('pending','confirmed')
            AND NOT ($4 <= start_time OR $3 >= end_time)
            `,
            [employee_id, id, start, end]
        );
        if (conflict.rowCount > 0) {
            const err = new Error("Ebben az időpontban már van foglalás!");
            err.status = 409;
            throw err;
        }

        // Frissítés → újra PENDING státusz
        const updateRes = await pool.query(
            `
            UPDATE bookings 
            SET start_time=$1, end_time=$2, status='pending'
            WHERE id=$3
            RETURNING *
            `,
            [start, end, id]
        );

        return updateRes.rows[0];
    }

    // Saját foglalás lemondása
    static async cancelOwnBooking(userId, bookingId) {
        const result = await pool.query(
            `UPDATE bookings 
            SET status = 'cancelled'
            WHERE id = $1 AND user_id = $2
            RETURNING *`,
            [bookingId, userId]
        );

        if (!result.rowCount) {
            const err = new Error("Nem található vagy nem a saját foglalásod!");
            err.status = 404;
            throw err;
        }

        return { message: "Foglalás sikeresen lemondva!" };
    }

}
