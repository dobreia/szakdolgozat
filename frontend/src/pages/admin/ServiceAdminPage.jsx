import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import "../../styles/services.css"; // 💚 csak custom styling
import "../../styles/global.css";

export default function ServicePage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorStatus, setErrorStatus] = useState(null);

    const [newService, setNewService] = useState({
        name: "",
        duration_minutes: "",
        price_cents: "",
    });

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const fetchServices = async () => {
        try {
            const res = await fetch("/api/services", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 401) {
                setErrorStatus(401);
                setError("A szolgáltatások megtekintéséhez be kell jelentkezned.");
                return;
            }
            if (res.status === 403) {
                setErrorStatus(403);
                setError("Nincs admin jogosultságod az oldal megtekintéséhez.");
                return;
            }

            if (!res.ok) throw new Error();

            const data = await res.json();
            setServices(data);

        } catch (err) {
            setError("Hiba történt az adatbetöltés során.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleAddService = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/services", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: newService.name,
                    duration_minutes: parseInt(newService.duration_minutes),
                    price_cents: parseInt(newService.price_cents),
                }),
            });

            if (!res.ok) throw new Error();

            fetchServices();
            setNewService({ name: "", duration_minutes: "", price_cents: "" });

        } catch (err) {
            setError("Hozzáadás sikertelen");
        }
    };

    const handleUpdate = async (id, updatedService) => {
        try {
            const res = await fetch(`/api/services/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedService),
            });

            if (!res.ok) throw new Error();
            fetchServices();

        } catch (err) {
            alert("Szerkesztés sikertelen");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Biztosan törlöd ezt a szolgáltatást?")) return;

        try {
            const res = await fetch(`/api/services/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error();
            fetchServices();

        } catch (err) {
            alert("Törlés sikertelen");
        }
    };

    if (loading) return <p>Betöltés...</p>;

    if (error) {
        return (
            <div className="admin-container container-lg text-center mt-4">
                <AdminHeader title="Szolgáltatások" />
                <p className="text-danger fw-bold mb-3">{error}</p>
            </div>
        );
    }

    return (
        <div className="admin-container container-lg">
            <AdminHeader title="Szolgáltatások" />

            {/* Új elem hozzáadása */}
            <form onSubmit={handleAddService} className="service-form mt-3 mb-4">
                <div className="row g-2">
                    <div className="col-md-3">
                        <input
                            type="text"
                            placeholder="Név"
                            value={newService.name}
                            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        />
                    </div>

                    <div className="col-md-3">
                        <input
                            type="number"
                            placeholder="Időtartam (perc)"
                            value={newService.duration_minutes}
                            onChange={(e) =>
                                setNewService({ ...newService, duration_minutes: e.target.value })
                            }
                        />
                    </div>

                    <div className="col-md-3">
                        <input
                            type="number"
                            placeholder="Ár (Ft)"
                            value={newService.price_cents}
                            onChange={(e) =>
                                setNewService({ ...newService, price_cents: e.target.value })
                            }
                        />
                    </div>

                    <div className="col-md-3">
                        <button type="submit" className="btn-success">Hozzáadás</button>
                    </div>
                </div>
            </form>


            <table className="service-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Név</th>
                        <th>Időtartam</th>
                        <th>Ár</th>
                        <th>Aktív</th>
                        <th>Műveletek</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((s) => (
                        <tr key={s.id}>
                            <td>{s.id}</td>
                            <td>{s.name}</td>
                            <td>{s.duration_minutes} perc</td>
                            <td>{s.price_cents} Ft</td>

                            <td>
                                <span className={`status-dot ${s.active ? "active" : "inactive"}`}></span>
                            </td>

                            <td className="actions">
                                <button
                                    className="btn-edit"
                                    onClick={() => navigate(`/admin/services/${s.id}/edit`)}
                                >
                                    Szerkesztés
                                </button>

                                <button
                                    className="btn-delete"
                                    onClick={() => handleDelete(s.id)}
                                >
                                    Törlés
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
