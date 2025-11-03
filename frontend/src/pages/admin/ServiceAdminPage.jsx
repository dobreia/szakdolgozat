import { useEffect, useState } from "react";
import "../../styles/services.css";
import "../../styles/global.css";

/**
 * Admin felület – Szolgáltatások kezelése
 * Funkciók:
 *  - listázás
 *  - új szolgáltatás hozzáadás
 *  - szerkesztés (ár/időtartam)
 *  - törlés
 */
export default function ServicePage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // új szolgáltatás form
    const [newService, setNewService] = useState({
        name: "",
        duration_minutes: "",
        price_cents: "",
    });

    // adatok betöltése
    const fetchServices = async () => {
        try {
            const res = await fetch("/api/services");
            const data = await res.json();
            setServices(data);
        } catch (err) {
            setError("Nem sikerült betölteni az adatokat.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // új szolgáltatás mentése
    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/services", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newService.name,
                    duration_minutes: parseInt(newService.duration_minutes),
                    price_cents: parseInt(newService.price_cents),
                }),
            });
            if (!res.ok) throw new Error("Hozzáadás sikertelen");
            await fetchServices();
            setNewService({ name: "", duration_minutes: "", price_cents: "" });
        } catch (err) {
            alert("Hiba: " + err.message);
        }
    };

    // módosítás
    const handleUpdate = async (id, updatedService) => {
        try {
            const res = await fetch(`/api/services/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedService),
            });
            if (!res.ok) throw new Error("Szerkesztés sikertelen");
            await fetchServices();
        } catch (err) {
            alert("Hiba: " + err.message);
        }
    };

    // törlés
    const handleDelete = async (id) => {
        if (!window.confirm("Biztosan törlöd ezt a szolgáltatást?")) return;
        try {
            const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Törlés sikertelen");
            await fetchServices();
        } catch (err) {
            alert("Hiba: " + err.message);
        }
    };

    if (loading) return <p>Betöltés...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="admin-container container-lg">
            <h2>Szolgáltatások</h2>

            {/* Új szolgáltatás hozzáadása */}
            <form onSubmit={handleAddService} className="service-form mt-3 mb-4">
                <div className="row g-2">
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Név"
                            value={newService.name}
                            onChange={(e) =>
                                setNewService({ ...newService, name: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Időtartam (perc)"
                            value={newService.duration_minutes}
                            onChange={(e) =>
                                setNewService({
                                    ...newService,
                                    duration_minutes: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Ár (Ft)"
                            value={newService.price_cents}
                            onChange={(e) =>
                                setNewService({ ...newService, price_cents: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="col-md-3">
                        <button type="submit" className="btn btn-success w-100">
                            Hozzáadás
                        </button>
                    </div>
                </div>
            </form>

            {/* Táblázat */}
            <table className="table table-striped align-middle">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Név</th>
                        <th>Időtartam (perc)</th>
                        <th>Ár (Ft)</th>
                        <th>Aktív</th>
                        <th>Műveletek</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((s) => (
                        <tr key={s.id}>
                            <td>{s.id}</td>
                            <td>
                                <input
                                    type="text"
                                    value={s.name}
                                    className="form-control"
                                    style={{ width: "150px" }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const updated = { ...s, name: value };
                                        setServices((prev) =>
                                            prev.map((srv) => (srv.id === s.id ? updated : srv))
                                        );
                                        if (value.trim() !== "") {
                                            handleUpdate(s.id, updated);
                                        }
                                    }}
                                />
                            </td>

                            <td>
                                <input
                                    type="number"
                                    value={s.duration_minutes ?? ""}
                                    className="form-control"
                                    style={{ width: "90px" }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // ha üres, csak a state-ben frissítjük lokálisan
                                        if (value === "") {
                                            const updated = services.map((srv) =>
                                                srv.id === s.id ? { ...srv, duration_minutes: "" } : srv
                                            );
                                            setServices(updated);
                                            return;
                                        }
                                        // ha nem üres, frissítjük a backendben is
                                        handleUpdate(s.id, { ...s, duration_minutes: parseInt(value) });
                                    }}
                                />

                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={s.price_cents ?? ""}
                                    className="form-control"
                                    style={{ width: "100px" }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === "") {
                                            const updated = services.map((srv) =>
                                                srv.id === s.id ? { ...srv, price_cents: "" } : srv
                                            );
                                            setServices(updated);
                                            return;
                                        }
                                        handleUpdate(s.id, { ...s, price_cents: parseInt(value) });
                                    }}
                                />

                            </td>
                            <td>{s.active ? "✅" : "❌"}</td>
                            <td>
                                <button
                                    className="btn btn-danger btn-sm"
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
