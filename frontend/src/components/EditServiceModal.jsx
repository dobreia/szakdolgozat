import { useState } from "react";
import "../styles/modal.css";

export default function EditServiceModal({ service, onClose, onSave }) {
    const [form, setForm] = useState({
        name: service.name,
        duration_minutes: service.duration_minutes,
        price_cents: service.price_cents,
        active: service.active,
    });

    const updateField = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(service.id, {
            ...form,
            duration_minutes: parseInt(form.duration_minutes),
            price_cents: parseInt(form.price_cents),
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <h3>Szolgáltatás szerkesztése</h3>

                <form onSubmit={handleSubmit} className="modal-form">
                    <label>Név</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                    />

                    <label>Időtartam (perc)</label>
                    <input
                        type="number"
                        value={form.duration_minutes}
                        onChange={(e) => updateField("duration_minutes", e.target.value)}
                    />

                    <label>Ár (Ft)</label>
                    <input
                        type="number"
                        value={form.price_cents}
                        onChange={(e) => updateField("price_cents", e.target.value)}
                    />

                    <div className="switch-row">
                        <label>Aktív</label>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={form.active}
                                onChange={() => updateField("active", !form.active)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>


                    <div className="modal-actions">
                        <button type="button" className="btn-delete" onClick={onClose}>
                            Mégse
                        </button>
                        <button type="submit" className="btn-success">
                            Mentés
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
