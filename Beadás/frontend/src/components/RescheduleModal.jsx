import { useState, useEffect } from "react"; // useState és useEffect hookok importálása
import "../styles/modal.css"; // Modal stíluslap importálása

export default function RescheduleModal({ booking, onSave, onClose }) {

    // Dátum formázása az input mezőhöz (YYYY-MM-DDTHH:MM formátum)
    const formatForInput = (dateStr) => {
        const date = new Date(dateStr);
        return date.toISOString().slice(0, 16); // Az ISO formátumból YYYY-MM-DDTHH:MM
    };

    // Állapot változó a módosítandó kezdési időponthoz
    const [newStart, setNewStart] = useState("");

    // Amikor megnyílik a modal → töltsük be az eredeti dátumot
    useEffect(() => {
        if (booking?.start_time) {
            setNewStart(formatForInput(booking.start_time)); // A dátum formázása és betöltése
        }
    }, [booking]); // A booking változásakor frissítjük az időpontot

    return (
        <div className="modal-overlay"> {/* Modal háttér */}
            <div className="modal-container"> {/* Modal tartalom */}
                <h3>Időpont módosítása</h3> {/* Modal címe */}

                <form className="modal-form">
                    <label>Új kezdési időpont:</label> {/* Időpont mező címkéje */}
                    <input
                        type="datetime-local" // Dátum és idő input típus
                        value={newStart} // Az új kezdési időpont
                        onChange={(e) => setNewStart(e.target.value)} // Az új időpont frissítése
                        required // Kötelező mező
                    />

                    <div className="modal-actions">
                        {/* Mégse gomb, bezárja a modalt */}
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                        >
                            Mégse
                        </button>
                        {/* Mentés gomb, hívja az onSave függvényt */}
                        <button
                            type="button"
                            className="btn-success"
                            onClick={() => onSave(booking.id, newStart)} // Új időpont mentése
                            disabled={!newStart} // Ha nincs megadva új időpont, a gomb inaktív
                        >
                            Mentés
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
