import { useEffect, useState } from "react";
import axios from "axios"; 
import "../styles/my-bookings.css"; 
import RescheduleModal from "../components/RescheduleModal"; 

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState([]); // Foglalások tárolása
    const [error, setError] = useState(""); // Hibaüzenet tárolása
    const [loading, setLoading] = useState(true); // Betöltési állapot
    const [editing, setEditing] = useState(null); // Jelenleg szerkesztés alatt álló foglalás

    // Dátum formázása, hogy megfeleljen a kívánt formátumnak
    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleString("hu-HU", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });

    // Foglalások betöltése az API-ból
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get("/api/bookings/my"); // API kérés a saját foglalások lekérésére
                setBookings(res.data); // Foglalások beállítása
            } catch (err) {
                setError("Nem sikerült betölteni a foglalásokat."); // Hibaüzenet beállítása
            } finally {
                setLoading(false); // Betöltés befejezése
            }
        };
        fetchBookings(); // Lekérjük a foglalásokat
    }, []); // A komponens kezdeti renderelésekor egyszer fut le

    // Ha betöltés alatt van, megjelenítjük a betöltési szöveget
    if (loading) return <p>Betöltés...</p>;

    // Ha hiba történt, azt jelenítjük meg
    if (error) return <div className="alert alert-danger">{error}</div>;

    // Foglalás törlése
    const cancelBooking = async (id) => {
        if (!window.confirm("Biztosan le szeretnéd mondani a foglalást?")) return; // Megerősítés kérése

        try {
            await axios.put(`/api/bookings/${id}/cancel`); // Foglalás törlése API kérés
            setBookings((prev) => prev.map(b => b.id === id ? { ...b, status: "cancelled" } : b)); // Foglalás státuszának frissítése
        } catch (err) {
            alert(err.response?.data?.error || "Foglalás lemondása sikertelen!"); // Hibaüzenet a törlés sikertelensége esetén
        }
    };

    // Időpont módosító modal megnyitása
    const openRescheduleModal = (booking) => {
        setEditing(booking); // Beállítjuk az aktuálisan szerkesztés alatt álló foglalást
    };

    // Foglalás időpontjának módosítása
    const saveReschedule = async (id, newStart) => {
        try {
            await axios.put(`/api/bookings/${id}/reschedule`, { start_time: newStart }); // Időpont módosítása API kérés
            setEditing(null); // Modal bezárása

            // Foglalások újra lekérése
            const res = await axios.get("/api/bookings/my");
            setBookings(res.data); // Foglalások frissítése
        } catch (err) {
            alert(err.response?.data?.error || "Időpont módosítása sikertelen!"); // Hibaüzenet, ha a módosítás nem sikerült
        }
    };

    return (
        <div className="my-bookings-container"> {/* Saját foglalások konténer */}
            <h2 className="my-bookings-title">Saját foglalásaim</h2>

            {/* Ha nincs foglalás */}
            {bookings.length === 0 ? (
                <p className="no-bookings">Nincs még foglalásod.</p> // Ha nincs foglalás, ezt jelenítjük meg
            ) : (
                <table className="my-bookings-table"> {/* Foglalások táblázata */}
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Szolgáltatás</th>
                            <th>Dolgozó</th>
                            <th>Kezdés</th>
                            <th>Befejezés</th>
                            <th>Státusz</th>
                            <th>Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((b) => (
                            <tr key={b.id}>
                                <td>{b.id}</td>
                                <td>{b.service_name}</td>
                                <td>{b.employee_name}</td>
                                <td>{formatDate(b.start_time)}</td> {/* Kezdési időpont formázása */}
                                <td>{formatDate(b.end_time)}</td> {/* Befejezési időpont formázása */}
                                <td>
                                    <span className={`status-badge status-${b.status}`}>
                                        <span className="status-dot"></span>
                                        {b.status === "confirmed"
                                            ? "Jóváhagyva"
                                            : b.status === "pending"
                                                ? "Függőben"
                                                : "Elutasítva"}
                                    </span>
                                </td>
                                <td className="actions-centered">
                                    {/* Ha a foglalás függőben van vagy jóváhagyott, és az időpont nem múlt el */}
                                    {(b.status === "confirmed" || b.status === "pending") &&
                                        new Date(b.start_time) > new Date() && (
                                            <div className="action-buttons">
                                                <button className="btn-edit"
                                                    onClick={() => openRescheduleModal(b)}>{/* Időpont módosítása */}
                                                    Módosítás
                                                </button>
                                                <button className="btn-delete"
                                                    onClick={() => cancelBooking(b.id)}>{/* Foglalás lemondása */}
                                                    Lemondás
                                                </button>
                                            </div>
                                        )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal megjelenítése, ha szerkesztés alatt van foglalás */}
            {editing && (
                <RescheduleModal
                    booking={editing} // Átadjuk a szerkesztés alatt álló foglalást
                    onSave={saveReschedule} // Mentés kezelése
                    onClose={() => setEditing(null)} // Modal bezárása
                />
            )}
        </div>
    );
}
