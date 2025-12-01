import { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import EditServiceModal from "../../components/EditServiceModal";
import "../../styles/services.css";

export default function ServicePage() {
    // Állapotváltozók a szolgáltatások kezelésére
    const [services, setServices] = useState([]); // Szolgáltatások listája
    const [loading, setLoading] = useState(true); // Betöltés állapota
    const [error, setError] = useState(null); // Hibaüzenet
    const [editingService, setEditingService] = useState(null); // Szerkesztett szolgáltatás állapota
    const [formError, setFormError] = useState(null); // Űrlap hibaüzenet

    // Új szolgáltatás adatai
    const [newService, setNewService] = useState({
        name: "",
        duration_minutes: "",
        price_cents: "",
    });

    const token = localStorage.getItem("token"); // Autentikációs token

    // Szolgáltatások betöltése az API-ból
    const fetchServices = async () => {
        try {
            const res = await fetch("/api/services", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Betöltési hiba"); // Hibaüzenet, ha a válasz nem sikeres

            const data = await res.json(); // Szolgáltatások JSON adatainak lekérése
            setServices(data); // Szolgáltatások beállítása
        } catch (err) {
            setError("Hiba történt a szolgáltatások betöltése során."); // Hibaüzenet beállítása
        } finally {
            setLoading(false); // Betöltés befejezése
        }
    };

    // Használatkor betölti a szolgáltatásokat
    useEffect(() => {
        fetchServices(); // Szolgáltatások betöltése a komponens indulásakor
    }, []); // Csak egyszer fut le

    // Új szolgáltatás hozzáadása
    const handleAddService = async (e) => {
        e.preventDefault(); // Alapértelmezett form submit letiltása
        setError(null); // Hiba törlése

        try {
            const res = await fetch("/api/services", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // JSON body küldése
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: newService.name,
                    duration_minutes: parseInt(newService.duration_minutes), // Időtartam átalakítása számra
                    price_cents: parseInt(newService.price_cents), // Ár átalakítása számra
                    active: true, // Szolgáltatás aktív állapota
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setFormError(data.message || "Hozzáadás sikertelen"); // Hibaüzenet beállítása
                return;
            }

            setNewService({ name: "", duration_minutes: "", price_cents: "" }); // Űrlap törlése
            setFormError(null); // Hibák törlése
            fetchServices(); // Szolgáltatások frissítése

        } catch {
            setError("Hálózati hiba történt!"); // Hálózati hiba üzenet
        }
    };

    // Szolgáltatás frissítése
    const handleUpdate = async (id, updated) => {
        try {
            const res = await fetch(`/api/services/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updated), // Frissített adatok küldése
            });

            if (!res.ok) throw new Error("Szerkesztés sikertelen"); // Hibaüzenet, ha a módosítás nem sikerül

            fetchServices(); // Szolgáltatások frissítése
        } catch (err) {
            alert("A szolgáltatás módosítása nem sikerült!"); // Hiba üzenet a felhasználónak
        }
    };

    // Szolgáltatás törlése
    const handleDelete = async (id) => {
        if (!window.confirm("Biztosan törlöd?")) return; // Törlés megerősítése

        try {
            const res = await fetch(`/api/services/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }, // Autentikációs header
            });

            if (!res.ok) throw new Error("Törlés sikertelen");

            fetchServices(); // Szolgáltatások frissítése törlés után
        } catch (err) {
            alert("A törlés nem sikerült!"); // Törlés hibaüzenet
        }
    };

    if (loading) return <p>Betöltés...</p>; // Betöltés közbeni üzenet
    if (error) return <p className="text-danger text-center">{error}</p>; // Hibaüzenet megjelenítése

    return (
        <div className="admin-container container-lg"> {/* Admin felület konténer */}
            <AdminHeader title="Szolgáltatások" /> {/* Admin fejléc */}
            {formError && <p className="form-error">{formError}</p>} {/* Űrlap hibaüzenet */}

            {/* Új szolgáltatás űrlap */}
            <form onSubmit={handleAddService} className="service-form mt-3 mb-4" noValidate>
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
                            onChange={(e) => setNewService({ ...newService, duration_minutes: e.target.value })}
                        />
                    </div>

                    <div className="col-md-3">
                        <input
                            type="number"
                            placeholder="Ár (Ft)"
                            value={newService.price_cents}
                            onChange={(e) => setNewService({ ...newService, price_cents: e.target.value })}
                        />
                    </div>

                    <div className="col-md-3">
                        <button type="submit" className="btn-success">Hozzáadás</button> {/* Hozzáadás gomb */}
                    </div>
                </div>
            </form>

            {/* Szolgáltatások táblázata */}
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
                    service={editingService} // A szerkesztett szolgáltatás adatainak átadása
                    onClose={() => setEditingService(null)} // Modal bezárása
                    onSave={handleUpdate} // Szolgáltatás frissítése
                />
            )}
        </div>
    );
}
