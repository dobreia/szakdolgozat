import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export function authRequired(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Hiányzó token" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: "Érvénytelen vagy lejárt token" });
    }
}

export function adminOnly(req, res, next) {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ error: "Csak adminoknak" });
    }
    next();
}
