import pool from "../db.js";

export default class EmployeesController {
    static async getAll() {
        const result = await pool.query("SELECT * FROM employees ORDER BY id");
        return result.rows;
    }

    static async create({ name, email }) {
        const result = await pool.query(
            "INSERT INTO employees (name, email) VALUES ($1, $2) RETURNING *",
            [name, email]
        );
        return result.rows[0];
    }

    static async update(id, { name, email }) {
        const result = await pool.query(
            "UPDATE employees SET name=$1, email=$2 WHERE id=$3 RETURNING *",
            [name, email, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query("DELETE FROM employees WHERE id=$1", [id]);
        return { message: "Dolgozó törölve" };
    }
}
