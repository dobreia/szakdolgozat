// controllers/UsersController.js
import pool from "../db.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export default class UsersController {
    static async getAll() {
        const result = await pool.query(
            "SELECT id, name, email, role FROM users ORDER BY id"
        );
        return result.rows;
    }

    static async create({ name, email, role, password }) {
        if (!name || !email || !password) {
            const err = new Error("Név, email és jelszó megadása kötelező.");
            err.status = 400;
            throw err;
        }

        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
        const finalRole = role === "admin" ? "admin" : "user";

        try {
            const result = await pool.query(
                "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
                [name, email, password_hash, finalRole]
            );
            return result.rows[0];
        } catch (e) {
            if (e.code === "23505") {
                const err = new Error("Ez az email már létezik.");
                err.status = 409;
                throw err;
            }
            throw e;
        }
    }

    static async updateRole(id, { role }) {
        const finalRole = role === "admin" ? "admin" : "user";

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

    static async delete(id) {
        const result = await pool.query("DELETE FROM users WHERE id=$1", [id]);

        if (result.rowCount === 0) {
            const err = new Error("Felhasználó nem található.");
            err.status = 404;
            throw err;
        }

        return { message: "Felhasználó törölve" };
    }
}
