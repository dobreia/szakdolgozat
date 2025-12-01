import "../styles/modal.css";

export default function LoginRequiredModal({ show, onClose, onConfirm }) {
    // Ha a modal nem látható, nem renderelünk semmit
    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onClose}> {/* Modal háttér, kattintásra bezárja a modalt */}
            <div className="modal-container" onClick={(e) => e.stopPropagation()}> {/* Modal tartalom, kattintásra nem zárja be */}
                <h3>Bejelentkezés szükséges</h3> {/* Modal címe */}

                <p className="mb-3">
                    A foglaláshoz először be kell jelentkezned. {/* Információ a felhasználónak */}
                </p>

                <div className="modal-actions">
                    {/* Mégsem gomb, bezárja a modalt */}
                    <button className="btn-delete" onClick={onClose}>
                        Mégsem
                    </button>

                    {/* Bejelentkezés gomb, meghívja a onConfirm callback-et */}
                    <button className="btn-success" onClick={onConfirm}>
                        Bejelentkezés
                    </button>
                </div>
            </div>
        </div>
    );
}
