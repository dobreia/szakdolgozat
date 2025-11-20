// JWT tokenek kezelése a felhasználók azonosításához
import jwt from "jsonwebtoken";

// A token ellenőrzéshez szükséges titkos kulcs
// Biztonságos környezetben a változó .env-ből érkezik
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// Middleware a hitelesítéshez
// Csak olyan végpont hívható meg, ahol érvényes JWT token van megadva
export function authRequired(req, res, next) {
    const authHeader = req.headers.authorization;

    // Token hiánya vagy hibás formátuma esetén tiltás
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Hiányzó token" });
    }

    // Token kivágása a headerből
    const token = authHeader.split(" ")[1];

    try {
        // Token hitelességének és lejárati idejének ellenőrzése
        const decoded = jwt.verify(token, JWT_SECRET);

        // Felhasználói adatok elérhetővé tétele a következő middleware-ek számára
        req.user = decoded;
        next();
    } catch (err) {
        // Rossz vagy lejárt token esetén belépés megtagadása
        res.status(401).json({ error: "Érvénytelen vagy lejárt token" });
    }
}

// Middleware az admin jogosultság ellenőrzésére
// Csak akkor enged tovább, ha a felhasználó szerepköre admin
export function adminOnly(req, res, next) {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ error: "Csak adminoknak" });
    }
    next();
}
