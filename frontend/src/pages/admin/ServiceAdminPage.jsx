import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import "../../styles/services.css";
import "../../styles/global.css";

/**
 * Admin felület – Szolgáltatások kezelése
 * Csak admin jogosultsággal elérhető!
 */
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
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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

            if (!res.ok) throw new Error("Hiba történt a lekérdezés során.");

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

    // Új szolgáltatás hozzáadása
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

            if (res.status === 403) {
                alert("Nincs admin jogosultságod a hozzáadáshoz!");
                return;
            }
            if (!res.ok) throw new Error("Hozzáadás sikertelen.");

            await fetchServices();
            setNewService({ name: "", duration_minutes: "", price_cents: "" });

        } catch (err) {
            alert("Hiba: " + err.message);
        }
    };

    // Módosítás
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

            if (res.status === 403) {
                alert("Nincs jogosultságod szolgáltatás szerkesztéséhez!");
                return;
            }
            if (!res.ok) throw new Error("Szerkesztés sikertelen");

            await fetchServices();
        } catch (err) {
            alert("Hiba: " + err.message);
        }
    };

    // Törlés
    const handleDelete = async (id) => {
        if (!window.confirm("Biztosan törlöd ezt a szolgáltatást?")) return;

        try {
            const res = await fetch(`/api/services/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 403) {
                alert("Nincs jogosultságod a törléshez!");
                return;
            }
            if (!res.ok) throw new Error("Törlés sikertelen");

            await fetchServices();
        } catch (err) {
            alert("Hiba: " + err.message);
        }
    };

    // Jogosultsági ellenőrzés megjelenítés
    if (loading) return <p>Betöltés...</p>;

    if (error) {
        return (
            <div className="admin-container container-lg text-center mt-4">
                <AdminHeader title="Szolgáltatások" />

                <p className="text-danger fw-bold mb-3">
                    {error}
                </p>

                {errorStatus === 401 && (
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/login")}
                    >
                        Bejelentkezés
                    </button>
                )}

                {errorStatus === 403 && (
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/")}
                    >
                        Vissza a főoldalra
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="admin-container container-lg">
            <AdminHeader title="Szolgáltatások" />

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

            {/* Szolgáltatások táblázat */}
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
                                    className="form-control"
                                    style={{ width: "150px" }}
                                    value={s.name}
                                    onChange={(e) => {
                                        const updated = { ...s, name: e.target.value };
                                        setServices((prev) =>
                                            prev.map((srv) =>
                                                srv.id === s.id ? updated : srv
                                            )
                                        );
                                        if (e.target.value.trim() !== "") {
                                            handleUpdate(s.id, updated);
                                        }
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="form-control"
                                    style={{ width: "100px" }}
                                    value={s.duration_minutes ?? ""}
                                    onChange={(e) => {
                                        if (e.target.value === "") {
                                            setServices((prev) =>
                                                prev.map((srv) =>
                                                    srv.id === s.id
                                                        ? { ...srv, duration_minutes: "" }
                                                        : srv
                                                )
                                            );
                                            return;
                                        }
                                        handleUpdate(s.id, {
                                            ...s,
                                            duration_minutes: parseInt(e.target.value),
                                        });
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="form-control"
                                    style={{ width: "110px" }}
                                    value={s.price_cents ?? ""}
                                    onChange={(e) => {
                                        if (e.target.value === "") {
                                            setServices((prev) =>
                                                prev.map((srv) =>
                                                    srv.id === s.id
                                                        ? { ...srv, price_cents: "" }
                                                        : srv
                                                )
                                            );
                                            return;
                                        }
                                        handleUpdate(s.id, {
                                            ...s,
                                            price_cents: parseInt(e.target.value),
                                        });
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
