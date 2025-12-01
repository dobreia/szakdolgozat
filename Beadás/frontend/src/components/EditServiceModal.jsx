import { useState } from "react";
import "../styles/modal.css"; 

export default function EditServiceModal({ service, onClose, onSave, token }) {
    // Form állapot inicializálása a szolgáltatás adataival
    const [form, setForm] = useState({
        name: service.name,
        duration_minutes: service.duration_minutes,
        price_cents: service.price_cents,
        active: service.active,
    });

    // Hibaüzenet állapot
    const [error, setError] = useState(null);

    // Mező frissítése és hiba törlése, ha a felhasználó javít
    const updateField = (field, value) => {
        setForm({ ...form, [field]: value });
        setError(null); //Hibát törli, miután a user javít
    };

    // Form beküldése
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Előző hibák törlése

        try {
            // PUT kérés a szolgáltatás frissítésére
            const res = await fetch(`/api/services/${service.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Auth token hozzáadása
                },
                body: JSON.stringify({
                    ...form,
                    duration_minutes: parseInt(form.duration_minutes), // Időtartam átalakítása
                    price_cents: parseInt(form.price_cents), // Ár átalakítása
                }),
            });

            const data = await res.json();

            // Hibakezelés, ha a válasz nem OK
            if (!res.ok) {
                setError(data.message || "Módosítás sikertelen.");
                return;
            }

            // Sikeres mentés után callback meghívása
            onSave(service.id, data);
            onClose(); // Modal bezárása

        } catch (err) {
            setError("Hálózati hiba történt! Kérlek próbáld újra."); // Hibaüzenet a hálózati hibák esetén
        }
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.stopPropagation()}> {/* Modal háttér */}
            <div className="modal-container" onClick={(e) => e.stopPropagation()}> {/* Modal tartalom */}
                <h3>Szolgáltatás szerkesztése</h3>

                {/* Hibák megjelenítése */}
                {error && <p className="modal-error">{error}</p>}

                <form onSubmit={handleSubmit} className="modal-form" noValidate>
                    <label>Név</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)} // Név frissítése
                    />

                    <label>Időtartam (perc)</label>
                    <input
                        type="number"
                        value={form.duration_minutes}
                        onChange={(e) => updateField("duration_minutes", e.target.value)} // Időtartam frissítése
                    />

                    <label>Ár (Ft)</label>
                    <input
                        type="number"
                        value={form.price_cents}
                        onChange={(e) => updateField("price_cents", e.target.value)} // Ár frissítése
                    />

                    <div className="switch-row"> {/* Állapot kapcsoló */}
                        <span>Aktív</span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={form.active}
                                onChange={() => updateField("active", !form.active)} // Állapot váltása
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="modal-actions">
                        {/* Mégse gomb */}
                        <button type="button" className="btn-delete" onClick={onClose}>
                            Mégse
                        </button>
                        {/* Mentés gomb */}
                        <button type="submit" className="btn-success">
                            Mentés
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
