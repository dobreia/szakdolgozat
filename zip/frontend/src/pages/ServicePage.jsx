import { useEffect, useState } from "react";
import "../styles/services.css"; // ha már van stílus
import "../styles/global.css";

export default function ServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // adatok betöltése a backendről
    const fetchServices = async () => {
        try {
            const res = await fetch("/api/services");
            if (!res.ok) throw new Error("Nem sikerült betölteni a szolgáltatásokat.");
            const data = await res.json();
            setServices(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    if (loading) return <p className="text-center mt-5">Betöltés...</p>;
    if (error) return <p className="text-danger text-center mt-5">{error}</p>;

    return (
        <div className="container-lg mt-5 mb-5">
            <h2 className="text-center mb-4">Szolgáltatásaink</h2>

            <div className="row g-4 justify-content-center">
                {services.map((s) => (
                    <div key={s.id} className="col-md-4 col-sm-6">
                        <div className="card service-card shadow-sm">
                            <div className="card-body text-center">
                                <h5 className="card-title mb-2">{s.name}</h5>
                                <p className="card-text text-muted mb-1">
                                    Időtartam: {s.duration_minutes} perc
                                </p>
                                <p className="card-text fw-semibold">
                                    Ár: {s.price_cents.toLocaleString()} Ft
                                </p>
                                <button className="btn btn-outline-primary btn-sm">
                                    Időpont foglalása
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
