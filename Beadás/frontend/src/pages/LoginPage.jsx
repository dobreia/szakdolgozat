import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/auth.css";
import visibleIcon from "../assets/icons/visible.png";
import invisibleIcon from "../assets/icons/invisible.png";

export default function LoginPage({ setUser }) {
    const [email, setEmail] = useState(""); // Bejelentkezett felhasználó email címének tárolása
    const [password, setPassword] = useState(""); // Bejelentkezett felhasználó jelszavának tárolása
    const [error, setError] = useState(""); // Hibaüzenet állapota
    const [showPassword, setShowPassword] = useState(false); // Jelszó láthatóságának állapota

    const navigate = useNavigate(); // A navigációs hook használata
    const location = useLocation(); // A location hook segítségével elérhetjük az URL query paramétereit

    //redirect paraméter kiolvasása
    const redirectTo =
        new URLSearchParams(location.search).get("redirect") || null; // A "redirect" query paraméter, ha létezik

    // Bejelentkezés kezelése
    const handleLogin = async (e) => {
        e.preventDefault(); // Form alapértelmezett submit eseményének letiltása
        setError(""); // Hibák törlése

        try {
            const res = await axios.post("/api/auth/login", { email, password }); // Bejelentkezési API kérés

            // mentés, auth fejléc frissítés
            localStorage.setItem("token", res.data.token); // Token mentése localStorage-ba
            localStorage.setItem("user", JSON.stringify(res.data.user)); // Felhasználói adatok mentése localStorage-ba
            setUser(res.data.user); // Felhasználó beállítása az állapotban
            axios.defaults.headers.common["Authorization"] =
                "Bearer " + res.data.token; // Axios alapértelmezett header frissítése

            //PRIORITÁS: ha volt redirect → oda megy vissza
            if (redirectTo) {
                navigate(redirectTo); // Ha redirect paraméter van, navigálás oda
                return;
            }

            // admin user → admin felületre
            if (res.data.user.role === "admin") {
                navigate("/admin"); // Admin felületre navigálás
                return;
            }

            // normál user → főoldal
            navigate("/"); // Normál felhasználó esetén a főoldalra navigálás

        } catch (err) {
            setError(err.response?.data?.error || "Hibás email vagy jelszó."); // Hibaüzenet beállítása
        }
    };

    return (
        <div className="auth-bg"> {/* Auth háttér */}
            <div className="auth-container"> {/* Auth tartalom konténer */}
                <h2>Bejelentkezés</h2> {/* Bejelentkezés cím */}

                {error && <p className="text-danger text-center">{error}</p>} {/* Hibaüzenet megjelenítése */}

                {/* Bejelentkezési űrlap */}
                <form className="auth-form" onSubmit={handleLogin} noValidate>
                    <div className="mb-3">
                        <label className="form-label">Email cím</label>
                        <input
                            type="text"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Email módosítása
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Jelszó</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"} // Jelszó típusának változtatása
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} // Jelszó módosítása
                                required
                            />
                            <span
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)} // Jelszó láthatóság változtatása
                            >
                                {showPassword ? (
                                    <img src={invisibleIcon} alt="Hide password" />
                                ) : (
                                    <img src={visibleIcon} alt="Show password" />
                                )}
                            </span>
                        </div>
                    </div>

                    <button type="submit" className="btn-auth"> {/* Bejelentkezés gomb */}
                        Belépés
                    </button>
                </form>

                {/* Regisztrációs link */}
                <p className="auth-link">
                    Nincs még fiókod?{" "}
                    <span
                        onClick={() =>
                            navigate(
                                redirectTo
                                    ? `/register?redirect=${redirectTo}` // Redirect paraméterrel regisztrációs oldal
                                    : "/register"
                            )
                        }
                    >
                        Regisztrálj itt!
                    </span>
                </p>
            </div>
        </div>
    );
}
