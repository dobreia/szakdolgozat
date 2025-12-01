import pool from "../db.js";

export default class EmployeesController {

    // Összes dolgozó lekérése
    static async getAll() {
        const result = await pool.query("SELECT * FROM employees ORDER BY id");
        return result.rows;
    }

    // Új dolgozó felvétele
    static async create({ name, email }) {

        // Név validálása
        if (!name || name.trim() === "") {
            const err = new Error("A név megadása kötelező!");
            err.status = 400;
            throw err;
        }

        // E-mail validálása
        if (!email || email.trim() === "") {
            const err = new Error("Az e-mail megadása kötelező!");
            err.status = 400;
            throw err;
        } else {
            // E-mail formátum ellenőrzése regex segítségével
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                const err = new Error("Érvénytelen e-mail formátum!");
                err.status = 400;
                throw err;
            }

            // Ellenőrizzük, hogy az e-mail már szerepel-e egy másik dolgozó adatainál
            const existing = await pool.query(
                "SELECT id FROM employees WHERE email = $1",
                [email]
            );
            if (existing.rowCount > 0) {
                const err = new Error("Ez az email már létezik egy másik dolgozónál!");
                err.status = 409;
                throw err;
            }
        }

        // Dolgozó felvétele az adatbázisba
        const result = await pool.query(
            "INSERT INTO employees (name, email) VALUES ($1, $2) RETURNING *",
            [name, email || null]
        );

        return result.rows[0];
    }

    // Dolgozó módosítása
    static async update(id, { name, email }) {

        // Név validálása
        if (!name || name.trim() === "") {
            const err = new Error("A név megadása kötelező!");
            err.status = 400;
            throw err;
        }

        // Ha van új e-mail, annak validálása
        if (email && email.trim() !== "") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                const err = new Error("Érvénytelen email formátum!");
                err.status = 400;
                throw err;
            }

            // Ellenőrizzük, hogy az új e-mail már egy másik dolgozóhoz tartozik-e
            const existing = await pool.query(
                "SELECT id FROM employees WHERE email = $1 AND id != $2",
                [email, id]
            );
            if (existing.rowCount > 0) {
                const err = new Error("Ez az email egy másik dolgozóhoz tartozik!");
                err.status = 409;
                throw err;
            }
        }

        // Dolgozó adatainak frissítése
        const result = await pool.query(
            "UPDATE employees SET name=$1, email=$2 WHERE id=$3 RETURNING *",
            [name, email || null, id]
        );

        // Ha nem található a dolgozó, hibát dobunk
        if (!result.rowCount) {
            const err = new Error("Dolgozó nem található!");
            err.status = 404;
            throw err;
        }

        return result.rows[0];
    }

    // Dolgozó törlése
    static async delete(id) {

        // Dolgozó törlése az adatbázisból
        const result = await pool.query(
            "DELETE FROM employees WHERE id=$1 RETURNING *",
            [id]
        );

        // Ha nem található a dolgozó, hibát dobunk
        if (!result.rowCount) {
            const err = new Error("Dolgozó nem található!");
            err.status = 404;
            throw err;
        }

        return { message: "Dolgozó törölve" };
    }
}
