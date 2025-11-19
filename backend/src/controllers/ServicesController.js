import pool from "../db.js";

// Szolgáltatások vezérlője – üzleti logika megvalósítása
export default class ServicesController {

  // Szolgáltatások listázása (GET)
  static async getAll() {
    const result = await pool.query("SELECT * FROM services ORDER BY id");
    return result.rows;
  }

  // Új szolgáltatás létrehozása (POST)
  static async create({ name, duration_minutes, price_cents }) {
    const result = await pool.query(
      `INSERT INTO services (name, duration_minutes, price_cents)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, duration_minutes, price_cents]
    );
    return result.rows[0];
  }

  // Szolgáltatás módosítása (PUT)
  static async update(id, data) {
    const result = await pool.query(
      `UPDATE services
         SET name=$1, duration_minutes=$2, price_cents=$3
       WHERE id=$4 RETURNING *`,
      [data.name, data.duration_minutes, data.price_cents, id]
    );
    return result.rows[0];
  }

  // Szolgáltatás törlése (DELETE)
  static async delete(id) {
    await pool.query(`DELETE FROM services WHERE id=$1`, [id]);
    return { message: "Törölve" };
  }
}

