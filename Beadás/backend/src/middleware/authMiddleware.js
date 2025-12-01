import jwt from "jsonwebtoken";

// Titkos kulcs a JWT token érvényesítéséhez
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// Middleware a hitelesítéshez
export function authRequired(req, res, next) {
    const authHeader = req.headers.authorization;

    // Ha nincs Authorization fejléc, átirányítás a login oldalra
    if (!authHeader) {
        return res.redirect('/login');
    }

    // Token kinyerése a fejlécből
    const token = authHeader.split(" ")[1]; // Feltételezve a 'Bearer <token>' formátumot

    // Token érvényesítése
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // Ha érvénytelen a token, átirányítás a login oldalra
            return res.redirect('/login');
        }
        req.user = user; // Felhasználó adatok hozzáadása a kéréshez
        next(); // Tovább a következő middleware-hez
    });
}

// Middleware admin jogosultsághoz
export function adminRequired(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        // Ha nem admin, 403 hiba
        return res.status(403).json({ message: "Hozzáférés megtagadva. Csak adminisztrátorok számára elérhető." });
    }
    next(); // Tovább a következő middleware-hez
}
