import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateUserInput } from "../lib/validateUser.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export default class AuthController {
    static async register(req, res) {
        try {
            const { name, email, password } = req.body;

            // Közös validáció
            const validationError = validateUserInput({ name, email, password });
            if (validationError) {
                return res.status(400).json({ error: validationError });
            }

            // Ellenőrizzük, hogy létezik-e már a felhasználó
            const existing = await pool.query(
                "SELECT id FROM users WHERE email = $1",
                [email]
            );
            if (existing.rows.length > 0) {
                return res.status(409).json({ error: "Ez az email cím már regisztrálva van!" });
            }

            // Jelszó titkosítása
            const hash = await bcrypt.hash(password, 10);

            // Új felhasználó beszúrása az adatbázisba
            const result = await pool.query(
                "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
                [name.trim(), email.trim(), hash, "user"]
            );

            res.status(201).json(result.rows[0]);

        } catch (err) {
            console.error("AUTH REGISTER ERROR:", err);
            res.status(500).json({ error: "A regisztráció nem sikerült. Kérjük, próbálja meg újra." });
        }
    }


    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Ellenőrizzük, hogy az email és a jelszó megadása kötelező
            if (!email || !password) {
                return res.status(400).json({ error: "Email és jelszó megadása kötelező!" });
            }

            // Felhasználó lekérése az adatbázisból
            const result = await pool.query(
                "SELECT * FROM users WHERE email = $1",
                [email.trim()]
            );
            const user = result.rows[0];

            // Ha a felhasználó nem található
            if (!user) {
                return res.status(401).json({ error: "Helytelen email vagy jelszó!" });
            }

            // Ellenőrizzük a jelszót
            const valid = await bcrypt.compare(password, user.password_hash);
            if (!valid) {
                return res.status(401).json({ error: "Helytelen email vagy jelszó!" });
            }

            // JWT token generálása
            const token = jwt.sign(
                { id: user.id, name: user.name, role: user.role },
                JWT_SECRET,
                { expiresIn: "3h" }
            );

            // Válasz a sikeres bejelentkezésről
            res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });

        } catch (err) {
            console.error("AUTH LOGIN ERROR:", err);
            res.status(500).json({ error: "Váratlan hiba történt a bejelentkezés során!" });
        }
    }
}
