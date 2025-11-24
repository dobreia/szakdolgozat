import { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import EditServiceModal from "../../components/EditServiceModal";
import "../../styles/services.css";
import "../../styles/global.css";

export default function ServicePage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingService, setEditingService] = useState(null);

    const [newService, setNewService] = useState({
        name: "",
        duration_minutes: "",
        price_cents: "",
    });

    const token = localStorage.getItem("token");

    const fetchServices = async () => {
        try {
            const res = await fetch("/api/services", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Betöltési hiba");

            const data = await res.json();
            setServices(data);
        } catch (err) {
            setError("Hiba történt a szolgáltatások betöltése során.");
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
                    active: true,
                }),
            });

            if (!res.ok) throw new Error("Hozzáadás sikertelen");

            setNewService({ name: "", duration_minutes: "", price_cents: "" });
            fetchServices();
        } catch (err) {
            setError("A szolgáltatás hozzáadása sikertelen.");
        }
    };

    const handleUpdate = async (id, updated) => {
        try {
            const res = await fetch(`/api/services/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updated),
            });

            if (!res.ok) throw new Error("Szerkesztés sikertelen");

            fetchServices();
        } catch (err) {
            alert("A szolgáltatás módosítása nem sikerült!");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Biztosan törlöd?")) return;

        try {
            const res = await fetch(`/api/services/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Törlés sikertelen");

            fetchServices();
        } catch (err) {
            alert("A törlés nem sikerült!");
        }
    };

    if (loading) return <p>Betöltés...</p>;
    if (error) return <p className="text-danger text-center">{error}</p>;

    return (
        <div className="admin-container container-lg">
            <AdminHeader title="Szolgáltatások" />

            {/* Új szolgáltatás űrlap */}
            <form onSubmit={handleAddService} className="service-form mt-3 mb-4">
                <div className="row g-2">
                    <div className="col-md-3">
                        <input
                            type="text"
                            placeholder="Név"
                            value={newService.name}
                            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="col-md-3">
                        <input
                            type="number"
                            placeholder="Időtartam (perc)"
                            value={newService.duration_minutes}
                            onChange={(e) => setNewService({ ...newService, duration_minutes: e.target.value })}
                            required
                        />
                    </div>

                    <div className="col-md-3">
                        <input
                            type="number"
                            placeholder="Ár (Ft)"
                            value={newService.price_cents}
                            onChange={(e) => setNewService({ ...newService, price_cents: e.target.value })}
                            required
                        />
                    </div>

                    <div className="col-md-3">
                        <button type="submit" className="btn-success">Hozzáadás</button>
                    </div>
                </div>
            </form>

            {/* Szolgáltatások táblázat */}
            <table className="service-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Név</th>
                        <th>Időtartam</th>
                        <th>Ár</th>
                        <th className="text-center">Aktív</th>
                        <th className="text-center">Műveletek</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((s) => (
                        <tr key={s.id}>
                            <td>{s.id}</td>
                            <td>{s.name}</td>
                            <td className="text-center">{s.duration_minutes} perc</td>
                            <td className="text-right">{s.price_cents.toLocaleString()} Ft</td>
                            <td className="text-center">
                                <span className={`status-dot ${s.active ? "active" : "inactive"}`}></span>
                            </td>
                            <td className="actions-centered">
                                <button className="btn-edit" onClick={() => setEditingService(s)}>Szerkesztés</button>
                                <button className="btn-delete" onClick={() => handleDelete(s.id)}>Törlés</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal megjelenítése */}
            {editingService && (
                <EditServiceModal
                    service={editingService}
                    onClose={() => setEditingService(null)}
                    onSave={handleUpdate}
                />
            )}
        </div>
    );
}
