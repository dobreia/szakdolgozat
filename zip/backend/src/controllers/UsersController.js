import pool from "../db.js";

export default class UsersController {
    static async getAll() {
        const result = await pool.query("SELECT id, name, email, role FROM users ORDER BY id");
        return result.rows;
    }

    static async create({ name, email, role }) {
        const result = await pool.query(
            "INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING id, name, email, role",
            [name, email, role || "user"]
        );
        return result.rows[0];
    }

    static async updateRole(id, { role }) {
        const result = await pool.query(
            "UPDATE users SET role=$1 WHERE id=$2 RETURNING id, name, email, role",
            [role, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query("DELETE FROM users WHERE id=$1", [id]);
        return { message: "Felhasználó törölve" };
    }
}
