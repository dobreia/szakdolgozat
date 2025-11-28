import jwt from "jsonwebtoken";

// Titkos kulcs a JWT token érvényesítéséhez
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// Middleware a hitelesítés biztosításához
export function authRequired(req, res, next) {
    const authHeader = req.headers.authorization;

    // Ellenőrizzük, hogy van-e Authorization fejléc
    if (!authHeader) {
        return res.redirect('/login'); // Ha nincs token, irányítsuk át a bejelentkezési oldalra
    }

    // Kinyerjük a tokent az Authorization fejlécből
    const token = authHeader.split(" ")[1]; // Feltételezzük, hogy 'Bearer <token>'

    // A token érvényesítése
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.redirect('/login'); // Ha a token érvénytelen, irányítsuk át a bejelentkezési oldalra
        }
        req.user = user; // A felhasználói adatokat hozzáadjuk a kérés objektumhoz
        next();
    });
}

// Middleware az admin jogosultságok biztosításához
export function adminRequired(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Hozzáférés megtagadva. Csak adminisztrátorok számára elérhető." });
    }
    next();
}
