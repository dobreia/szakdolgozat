import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginRequiredModal from "../components/LoginRequiredModal";
import "../styles/services-public.css";

export default function ServicesPage() {
    const [services, setServices] = useState([]); // Szolgáltatások tárolása
    const [loading, setLoading] = useState(true); // Betöltési állapot
    const [error, setError] = useState(null); // Hibaállapot

    const [showModal, setShowModal] = useState(false); // A modal megjelenítésének kezelése
    const [selectedService, setSelectedService] = useState(null); // Kiválasztott szolgáltatás tárolása

    const navigate = useNavigate(); // A navigációhoz szükséges hook

    // Szolgáltatások betöltése
    const fetchServices = async () => {
        try {
            const res = await fetch("/api/services?public=true"); // Szolgáltatások lekérése
            if (!res.ok) throw new Error("Nem sikerült betölteni a szolgáltatásokat."); // Hiba kezelése, ha nem sikerül a fetch
            setServices(await res.json()); // Szolgáltatások tárolása a state-ben
        } catch (err) {
            setError(err.message); // Hibaüzenet beállítása
        } finally {
            setLoading(false); // Betöltés befejezése
        }
    };

    // A komponens első renderelésekor betöltjük a szolgáltatásokat
    useEffect(() => {
        fetchServices(); // Szolgáltatások betöltése
    }, []); // Csak egyszer hívódik meg, amikor a komponens először renderelődik

    // A foglalás gombra kattintás kezelése
    const handleBookingClick = (serviceId) => {
        const token = localStorage.getItem("token"); // Token lekérése a localStorage-ból

        // Ha nincs token (nem bejelentkezett), akkor megjelenítjük a bejelentkezés szükséges modal-t
        if (!token) {
            setSelectedService(serviceId); // Kiválasztott szolgáltatás tárolása
            setShowModal(true); // Modal megjelenítése
        } else {
            // Ha van token (be van jelentkezve), navigálunk a foglalási oldalra
            navigate(`/booking?service=${serviceId}`);
        }
    };

    // Ha a szolgáltatások még töltődnek, megjelenítjük a betöltési üzenetet
    if (loading) return <p className="text-center mt-5">Betöltés...</p>;

    // Ha hiba történt, megjelenítjük a hibaüzenetet
    if (error) return <p className="text-danger text-center mt-5">{error}</p>;

    return (
        <div className="container-lg mt-5 mb-5 page-content">
            <h2 className="text-center mb-4">Szolgáltatásaink</h2>

            <div className="row g-4 justify-content-center">
                {/* Szűrés: csak aktív szolgáltatások jelenjenek meg */}
                {services.filter(s => s.active !== false).map((s) => (
                    <div key={s.id} className="col-md-4 col-sm-6">
                        <div className="service-card shadow-sm text-center">
                            <h5 className="card-title mb-2">{s.name}</h5>

                            <p className="text-muted mb-1 service-description">
                                Időtartam: {Math.round(s.duration_minutes)} perc
                            </p>

                            <p className="service-price mb-3">
                                {(s.price_cents).toLocaleString()} Ft
                            </p>

                            <button
                                className="btn-book"
                                // Kattintáskor hívjuk meg a foglalás funkciót
                                onClick={() => handleBookingClick(s.id)}
                            >
                                Időpont foglalása
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal megjelenítése, ha a bejelentkezés szükséges */}
            <LoginRequiredModal
                show={showModal}
                onClose={() => setShowModal(false)} // Modal bezárása
                // Bejelentkezés után a foglalásra irányítás
                onConfirm={() => navigate(`/login?redirect=/booking?service=${selectedService}`)}
            />
        </div>
    );
}
