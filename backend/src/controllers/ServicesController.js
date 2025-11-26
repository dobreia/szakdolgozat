import pool from "../db.js";

export default class ServicesController {

  // Szolgáltatások listázása (GET)
  static async getAllPublic() {
    const result = await pool.query(
      "SELECT id, name, duration_minutes, price_cents FROM services WHERE active = true ORDER BY id"
    );
    return result.rows;
  }
  
  // Adminnak minden kell (active mezővel)
  static async getAllAdmin() {
    const result = await pool.query(
      "SELECT id, name, duration_minutes, price_cents, active FROM services ORDER BY id"
    );
    return result.rows;
  }


  // Új szolgáltatás létrehozása (POST)
  static async create({ name, duration_minutes, price_cents, active }) {

    // Szerveroldali validációk
    if (!name || name.trim() === "") {
      return { error: "A név megadása kötelező!", status: 400 };
    }

    if (duration_minutes === "" || duration_minutes === null || isNaN(duration_minutes)) {
      return { error: "Az időtartam megadása kötelező!", status: 400 };
    } else if (duration_minutes <= 0) {
      return { error: "Az időtartamnak pozitív számnak kell lennie!", status: 400 };
    }

    if (price_cents === "" || price_cents === null || isNaN(price_cents)) {
      return { error: "Az ár megadása kötelező!", status: 400 };
    } else if (price_cents <= 0) {
      return { error: "Az árnak pozitív számnak kell lennie!", status: 400 };
    }

    try {
      const result = await pool.query(
        `INSERT INTO services (name, duration_minutes, price_cents, active)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, duration_minutes, price_cents, active ?? true]
      );
      return result.rows[0];
    } catch (err) {
      console.error("SERVICE CREATE ERROR:", err);
      return { error: "A szolgáltatás létrehozása nem sikerült.", status: 500 };
    }
  }


  // Szolgáltatás módosítása (PUT)
  static async update(id, data) {

    if (!data.name || data.name.trim() === "") {
      return { error: "A név megadása kötelező!", status: 400 };
    }

    if (data.duration_minutes === "" || data.duration_minutes === null || isNaN(data.duration_minutes)) {
      return { error: "Az időtartam megadása kötelező!", status: 400 };
    } else if (data.duration_minutes <= 0) {
      return { error: "Az időtartamnak pozitív számnak kell lennie!", status: 400 };
    }


    if (data.price_cents === "" || data.price_cents === null || isNaN(data.price_cents)) {
      return { error: "Az ár megadása kötelező!", status: 400 };
    } else if (data.price_cents <= 0) {
      return { error: "Az árnak pozitív számnak kell lennie!", status: 400 };
    }

    try {
      const result = await pool.query(
        `UPDATE services
       SET name=$1, duration_minutes=$2, price_cents=$3, active=$4
       WHERE id=$5
       RETURNING *`,
        [data.name, data.duration_minutes, data.price_cents, data.active, id]
      );

      if (result.rowCount === 0) {
        return { error: "A szolgáltatás nem található!", status: 404 };
      }

      return result.rows[0];

    } catch (err) {
      console.error("SERVICE UPDATE ERROR:", err);
      return { error: "A módosítás nem sikerült!", status: 500 };
    }
  }


  // Szolgáltatás törlése (DELETE)
  static async delete(id) {
    try {
      const result = await pool.query(
        `DELETE FROM services WHERE id=$1 RETURNING *`,
        [id]
      );

      if (result.rowCount === 0) {
        return { error: "A szolgáltatás nem található!", status: 404 };
      }

      return { message: "A szolgáltatás sikeresen törölve." };

    } catch (err) {
      console.error("SERVICE DELETE ERROR:", err);
      return { error: "A törlés nem sikerült!", status: 500 };
    }
  }
}
