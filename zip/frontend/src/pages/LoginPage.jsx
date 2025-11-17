import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/auth/login", { email, password });

            // token mentése
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            setUser(res.data.user);
            axios.defaults.headers.common["Authorization"] = "Bearer " + res.data.token;

            // ha admin → admin oldal, ha user → főoldal
            if (res.data.user.role === "admin") navigate("/admin");
            else navigate("/");
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.error || "Hibás email vagy jelszó"
            );
        }
    };

    return (
        <div className="login-page">
            <h2>Bejelentkezés</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Jelszó"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Belépés</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
}
