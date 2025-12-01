import pool from "./src/db.js";
import bcrypt from "bcrypt";

async function seed() {
  const adminPass = await bcrypt.hash("Admin123", 10);

  await pool.query(`
    INSERT INTO users (name, email, password_hash, role)
    VALUES ('Admin', 'admin2@example.com', '${adminPass}', 'admin')
  `);

  await pool.query(`
    INSERT INTO employees (name, email) VALUES
    ('Nagy Éva', 'eva@szalon.hu'),
    ('Kovács Dóra', 'dora@szalon.hu')
  `);

  await pool.query(`
    INSERT INTO services (name, duration_minutes, price_cents, active) VALUES
    ('Hajvágás', 45, 6000, true),
    ('Smink', 60, 12000, true),
    ('Manikűr', 40, 8000, true)
  `);

  console.log("Seed kész!");
  pool.end();
}

seed();
