import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export default class AuthController {
    static async register(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password)
                return res.status(400).json({ error: "Minden mező kötelező" });

            const existing = await pool.query(
                "SELECT * FROM users WHERE email = $1",
                [email]
            );
            if (existing.rows.length > 0)
                return res.status(400).json({ error: "Ezzel az email címmel már van felhasználó" });

            const hash = await bcrypt.hash(password, 10);

            const result = await pool.query(
                "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
                [name, email, hash, "user"]
            );

            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Regisztráció sikertelen" });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
            const user = result.rows[0];

            if (!user) {
                return res.status(400).json({ error: "Hibás email vagy jelszó" });
            }

            if (!user.password_hash) {
                console.error("❌ A felhasználónak nincs jelszó-hash tárolva:", user.email);
                return res.status(400).json({ error: "Hibás email vagy jelszó" });
            }

            const valid = await bcrypt.compare(password, user.password_hash);
            if (!valid) {
                return res.status(400).json({ error: "Hibás email vagy jelszó" });
            }

            const token = jwt.sign(
                { id: user.id, name: user.name, role: user.role },
                JWT_SECRET,
                { expiresIn: "3h" }
            );

            res.json({
                token,
                user: { id: user.id, name: user.name, email: user.email, role: user.role },
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Bejelentkezés sikertelen" });
        }
    }

}
