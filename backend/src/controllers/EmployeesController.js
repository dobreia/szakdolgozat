import pool from "../db.js";

export default class EmployeesController {

    // Összes dolgozó lekérése
    static async getAll() {
        const result = await pool.query("SELECT * FROM employees ORDER BY id");
        return result.rows;
    }

    // Új dolgozó felvétele
    static async create({ name, email }) {

        if (!name || name.trim() === "") {
            const err = new Error("A név megadása kötelező!");
            err.status = 400;
            throw err;
        }

        if (!email || email.trim() === "") {
            const err = new Error("Az email megadása kötelező!");
            err.status = 400;
            throw err;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                const err = new Error("Érvénytelen email formátum!");
                err.status = 400;
                throw err;
            }

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

        const result = await pool.query(
            "INSERT INTO employees (name, email) VALUES ($1, $2) RETURNING *",
            [name, email || null]
        );

        return result.rows[0];
    }

    // Dolgozó módosítása
    static async update(id, { name, email }) {

        if (!name || name.trim() === "") {
            const err = new Error("A név megadása kötelező!");
            err.status = 400;
            throw err;
        }

        if (email && email.trim() !== "") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                const err = new Error("Érvénytelen email formátum!");
                err.status = 400;
                throw err;
            }

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

        const result = await pool.query(
            "UPDATE employees SET name=$1, email=$2 WHERE id=$3 RETURNING *",
            [name, email || null, id]
        );

        if (!result.rowCount) {
            const err = new Error("Dolgozó nem található!");
            err.status = 404;
            throw err;
        }

        return result.rows[0];
    }

    // Dolgozó törlése
    static async delete(id) {

        const result = await pool.query(
            "DELETE FROM employees WHERE id=$1 RETURNING *",
            [id]
        );

        if (!result.rowCount) {
            const err = new Error("Dolgozó nem található!");
            err.status = 404;
            throw err;
        }

        return { message: "Dolgozó törölve" };
    }
}
