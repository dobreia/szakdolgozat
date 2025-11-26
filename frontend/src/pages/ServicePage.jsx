import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginRequiredModal from "../components/LoginRequiredModal"; // ✔ új modal
import "../styles/services-public.css";

export default function ServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const navigate = useNavigate();

    const fetchServices = async () => {
        try {
            const res = await fetch("/api/services?public=true");
            if (!res.ok) throw new Error("Nem sikerült betölteni a szolgáltatásokat.");
            setServices(await res.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleBookingClick = (serviceId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            setSelectedService(serviceId);
            setShowModal(true);
        } else {
            navigate(`/booking?service=${serviceId}`);
        }
    };

    if (loading) return <p className="text-center mt-5">Betöltés...</p>;
    if (error) return <p className="text-danger text-center mt-5">{error}</p>;

    return (
        <div className="container-lg mt-5 mb-5 page-content">
            <h2 className="text-center mb-4">Szolgáltatásaink</h2>

            <div className="row g-4 justify-content-center">
                {services.filter(s => s.active !== false).map((s) => (
                    <div key={s.id} className="col-md-4 col-sm-6">
                        <div className="service-card shadow-sm text-center">
                            <h5 className="card-title mb-2">{s.name}</h5>

                            <p className="text-muted mb-1 service-description">
                                Időtartam: {Math.round(s.duration_minutes / 60 * 10) / 10} óra
                            </p>

                            <p className="service-price mb-3">
                                {(s.price_cents).toLocaleString()} Ft
                            </p>

                            <button
                                className="btn-book"
                                onClick={() => handleBookingClick(s.id)}
                            >
                                Időpont foglalása
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* 🔔 Figyelmeztető modal (bejelentkezés szükséges) */}
            <LoginRequiredModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={() => navigate(`/login?redirect=/booking?service=${selectedService}`)}
            />
        </div>
    );
}
