import pg from "pg";
import dotenv from "dotenv";

// Környezeti változók betöltése
dotenv.config();

// Pool létrehozása a PostgreSQL adatbázis kapcsolat kezeléséhez
const { Pool } = pg;

// Pool inicializálása a DATABASE_URL környezeti változóval
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Az adatbázis elérhetősége
});

// Csatlakozás az adatbázishoz
pool
    // Kapcsolódás az adatbázishoz
    .connect()
    // Sikeres kapcsolódás esetén üzenet
    .then(() => console.log("Database connected"))
    // Hiba esetén hibaüzenet
    .catch((err) => console.error("Database connection error", err));

export default pool;
