import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./db.js";
import authRoutes from "./routes/authRoutes.js";
import bookingsRoutes from "./routes/bookingsRoutes.js";
import employeesRoutes from "./routes/employeesRoutes.js";
import servicesRoutes from "./routes/servicesRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import { authRequired, adminOnly } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

// 🔓 Nyilvános végpontok
app.use("/api/auth", authRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/employees", employeesRoutes);  // <── már NEM védett

// 🔐 Csak bejelentkezett vagy admin felhasználóknak
app.use("/api/bookings", authRequired, bookingsRoutes);
app.use("/api/users", authRequired, adminOnly, usersRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
