import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/home.css';

export default function HomePage() {
    const [health, setHealth] = useState(null); // Rendszer egészség állapotának tárolása
    const navigate = useNavigate(); // Navigációs hook a route-ok közötti váltáshoz

    const user = JSON.parse(localStorage.getItem("user")); // A bejelentkezett felhasználó adatainak lekérése

    // Rendszer állapotának lekérése (API-kérés)
    useEffect(() => {
        fetch("/api/health") // Egészség állapot lekérése
            .then((res) => res.json()) // Válasz JSON-ra konvertálása
            .then(setHealth) // Egészség állapot beállítása
            .catch(() => setHealth({ ok: false })); // Hiba esetén egészség állapot hamis értéke
    }, []); // Csak egyszer fut le, a komponens első renderelésekor

    // Időpontfoglalás gomb kattintás kezelése
    const handleClick = () => {
        if (user) { // Ha van bejelentkezett felhasználó
            navigate("/booking"); // Időpontfoglalás oldalra navigálás
        } else {
            navigate("/services"); // Szolgáltatások oldalra navigálás
        }
    };

    return (
        <header className="hero"> {/* Hero szekció, háttér és fő tartalom */}
            <div className="overlay" /> {/* Háttér réteg, átlátszó */}
            <div className="content container"> {/* A fő tartalom doboza */}
                <h1 className="title">Varázs Szépségszalon</h1> {/* Fő cím */}
                <div className="separator"></div> {/* Választó vonal */}
                <h2 className="subtitle">Fodrászat • Smink • Manikűr • Tanácsadás</h2> {/* Alcím a szolgáltatásokkal */}

                <button onClick={handleClick} className="btn-cta"> {/* Gomb a kattintás kezelésére */}
                    Időpont foglalása
                </button>
            </div>
        </header>
    );
}
