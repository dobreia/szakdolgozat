import pool from "../db.js";
import bcrypt from "bcrypt";
import { validateUserInput } from "../lib/validateUser.js";

const SALT_ROUNDS = 10;

export default class UsersController {

    // Összes felhasználó lekérése
    static async getAll() {
        const result = await pool.query(
            "SELECT id, name, email, role FROM users ORDER BY id"
        );
        return result.rows; // Felhasználók listájának visszaadása
    }

    // ÚJ FELHASZNÁLÓ LÉTREHOZÁSA (Admin panel)
    static async create({ name, email, role, password }) {

        // Felhasználói adatok validálása (ugyanaz, mint a regisztrációnál)
        const validationError = validateUserInput({ name, email, password });
        if (validationError) {
            const err = new Error(validationError);
            err.status = 400;
            throw err;
        }

        // Admin szerepkör beállítása, ha szükséges
        const finalRole = role === "admin" ? "admin" : "user";
        const hash = await bcrypt.hash(password, SALT_ROUNDS);

        try {
            // Új felhasználó hozzáadása az adatbázishoz
            const result = await pool.query(
                "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
                [name.trim(), email.trim(), hash, finalRole]
            );
            return result.rows[0];

        } catch (e) {
            // E-mail ütközés ellenőrzése
            if (e.code === "23505") {
                const err = new Error("Ez az email már létezik.");
                err.status = 409;
                throw err;
            }
            // Más hibák kezelése
            throw e;
        }
    }

    // SZEREPKÖR MÓDOSÍTÁSA — Csak adminok számára
    static async updateRole(id, { role }, currentUserId) {

        const finalRole = role === "admin" ? "admin" : "user";

        // Admin magát nem tudja leminősíteni
        if (id == currentUserId && finalRole !== "admin") {
            const err = new Error("Saját admin jogosultság nem szüntethető meg!");
            err.status = 403;
            throw err;
        }

        // Szerepkör módosítása az adatbázisban
        const result = await pool.query(
            "UPDATE users SET role=$1 WHERE id=$2 RETURNING id, name, email, role",
            [finalRole, id]
        );

        if (result.rowCount === 0) {
            const err = new Error("Felhasználó nem található.");
            err.status = 404;
            throw err;
        }

        return result.rows[0];
    }


    // FELHASZNÁLÓ TÖRLÉSE — Csak adminok számára
    static async delete(id, currentUserId) {

        // Saját fiók nem törölhető
        if (id == currentUserId) {
            const err = new Error("Saját fiók nem törölhető!");
            err.status = 403;
            throw err;
        }

        // Az utolsó admin törlésének megakadályozása
        const adminCount = await pool.query(
            "SELECT COUNT(*) FROM users WHERE role='admin'"
        );

        if (adminCount.rows[0].count <= 1) {
            const err = new Error("Az utolsó admin nem törölhető!");
            err.status = 403;
            throw err;
        }

        // Felhasználó törlése az adatbázisból
        const result = await pool.query(
            "DELETE FROM users WHERE id=$1", [id]
        );

        if (result.rowCount === 0) {
            const err = new Error("Felhasználó nem található.");
            err.status = 404;
            throw err;
        }

        // A törlés sikeres üzenete
        return { message: "Felhasználó törölve" };
    }
}
