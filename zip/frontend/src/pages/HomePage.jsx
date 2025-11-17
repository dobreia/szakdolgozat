import { useEffect, useState } from "react";
import '../styles/home.css';

export default function HomePage() {
    const [health, setHealth] = useState(null);

    useEffect(() => {
        fetch("/api/health")
            .then((res) => res.json())
            .then(setHealth)
            .catch(() => setHealth({ ok: false }));
    }, []);

    return (
        <>
            <header className="hero">
                <div className="content container">
                    <h1>Varázs szépségszalon</h1>
                    <h2>Fodrászat • Smink • Manikűr • Tanácsadás </h2>

                    {/*<a href="/booking"><button>Időpont foglalása</button></a>
                    <div style={{ marginTop: 16 }}>
                        <small>API health: {health ? (health.ok ? "OK ✅" : "HIBA ❌") : "..."}</small>
                    </div>*/}
                </div>
            </header>
        </>

    );
}