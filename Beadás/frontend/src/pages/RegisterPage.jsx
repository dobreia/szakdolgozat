import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";
import visibleIcon from "../assets/icons/visible.png";
import invisibleIcon from "../assets/icons/invisible.png";

export default function RegisterPage() {
    const navigate = useNavigate(); // A navigációhoz szükséges hook
    const location = useLocation(); // Az URL paraméterekhez szükséges hook

    // Állapotok a felhasználó adataihoz és hibákhoz
    const [name, setName] = useState(""); // Felhasználó neve
    const [email, setEmail] = useState(""); // Felhasználó email címe
    const [password, setPassword] = useState(""); // Jelszó
    const [confirmPassword, setConfirmPassword] = useState(""); // Jelszó megerősítése
    const [error, setError] = useState(""); // Hibák tárolása
    const [showPassword1, setShowPassword1] = useState(false); // Jelszó láthatósága az első mezőben
    const [showPassword2, setShowPassword2] = useState(false); // Jelszó láthatósága a megerősítés mezőben

    // Lekérjük a redirect paramétert, ha van
    const redirectTo = new URLSearchParams(location.search).get("redirect") || null;

    // Regisztráció kezelése
    const handleRegister = async (e) => {
        e.preventDefault(); // Form alapértelmezett viselkedésének letiltása
        setError(""); // Hibaüzenet törlése

        // Jelszavak összehasonlítása
        if (password !== confirmPassword) {
            setError("A két jelszó nem egyezik meg!"); // Ha a jelszavak nem egyeznek, hibaüzenet
            return;
        }

        try {
            await axios.post("/api/auth/register", {
                name,
                email,
                password,
            }); // Regisztrációs API kérés

            // Sikeres regisztráció után navigálás a login oldalra
            if (redirectTo) {
                navigate(`/login?redirect=${redirectTo}`); // Redirect paraméterrel való navigálás
            } else {
                navigate("/login"); // Alapértelmezett login oldalra navigálás
            }

        } catch (err) {
            console.error("Register error:", err); // Hiba logolása

            // Hibaüzenet beállítása
            const message =
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Hiba a regisztrációnál!";
            setError(message); // Hibás regisztrációs próbálkozás üzenet megjelenítése
        }
    };

    return (
        <div className="auth-bg"> {/* Auth háttér */}
            <div className="auth-container"> {/* Auth konténer */}
                <h2>Regisztráció</h2> {/* Regisztrációs cím */}

                {error && <p className="text-danger text-center">{error}</p>} {/* Hibaüzenet megjelenítése */}

                {/* Regisztrációs űrlap */}
                <form onSubmit={handleRegister} className="auth-form" noValidate>
                    <div className="mb-3">
                        <label className="form-label">Név</label>
                        <input
                            type="text"
                            className="form-control"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)} // Név változtatása
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email cím</label>
                        <input
                            type="text"
                            className="form-control"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Email változtatása
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Jelszó</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword1 ? "text" : "password"} // Jelszó láthatóság változtatása
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} // Jelszó változtatása
                                required
                            />
                            <span
                                className="toggle-password"
                                onClick={() => setShowPassword1(!showPassword1)} // Jelszó láthatóság togglézása
                            >
                                <img src={showPassword1 ? invisibleIcon : visibleIcon} alt="" />
                            </span>
                        </div>

                        <label className="form-label">Jelszó megerősítése</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword2 ? "text" : "password"} // Jelszó megerősítés láthatóság változtatása
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} // Jelszó megerősítése változtatása
                                required
                            />
                            <span
                                className="toggle-password"
                                onClick={() => setShowPassword2(!showPassword2)} // Jelszó megerősítés láthatóság togglézása
                            >
                                <img src={showPassword2 ? invisibleIcon : visibleIcon} alt="" />
                            </span>
                        </div>
                    </div>

                    <button type="submit" className="btn-auth"> {/* Regisztráció gomb */}
                        Regisztráció
                    </button>
                </form>

                {/* Ha már van fiók, a bejelentkezés link */}
                <p className="auth-link">
                    Van már fiókod?{" "}
                    <span
                        onClick={() =>
                            navigate(
                                redirectTo
                                    ? `/login?redirect=${redirectTo}` // Redirect paraméterrel bejelentkezés
                                    : "/login"
                            )
                        }
                    >
                        Jelentkezz be!
                    </span>
                </p>
            </div>
        </div>
    );
}
