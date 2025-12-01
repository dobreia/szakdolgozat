import { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../../components/AdminHeader";

import "../../styles/booking.css";

export default function BookingAdminPage() {
    // Állapotváltozók az adatok tárolására
    const [bookings, setBookings] = useState([]); // Foglalások állapota
    const [employees, setEmployees] = useState([]); // Dolgozók állapota
    const [services, setServices] = useState([]); // Szolgáltatások állapota
    const [users, setUsers] = useState([]); // Felhasználók állapota

    // Új foglalás adatai
    const [newBooking, setNewBooking] = useState({
        user_id: "",
        service_id: "",
        employee_id: "",
        start_time: "",
    });

    // Hibák állapota
    const [error, setError] = useState("");

    // Token az autentikációhoz
    const token = localStorage.getItem("token");
    const authHeader = token ? { Authorization: "Bearer " + token } : {}; // Auth header a kérésekhez

    // Felhasználók betöltése
    const fetchUsers = async () => {
        try {
            const res = await axios.get("/api/users", { headers: authHeader });
            setUsers(Array.isArray(res.data) ? res.data : []); // Felhasználók beállítása
        } catch (err) {
            setUsers([]); // Ha hiba történik, üres lista
        }
    };

    // Dolgozók betöltése
    const fetchEmployees = async () => {
        try {
            const res = await axios.get("/api/employees", { headers: authHeader });
            setEmployees(Array.isArray(res.data) ? res.data : []); // Dolgozók beállítása
        } catch (err) {
            console.error("EMPLOYEE LOAD ERROR", err); // Hiba loggolása
            setEmployees([]); // Ha hiba történik, üres lista
        }
    };

    // Szolgáltatások betöltése
    const fetchServices = async () => {
        try {
            const res = await axios.get("/api/services", { headers: authHeader });
            setServices(Array.isArray(res.data) ? res.data : []); // Szolgáltatások beállítása
        } catch {
            setServices([]); // Ha hiba történik, üres lista
        }
    };

    // Foglalások betöltése
    const fetchBookings = async () => {
        try {
            const res = await axios.get("/api/bookings", { headers: authHeader });
            setBookings(Array.isArray(res.data) ? res.data : []); // Foglalások beállítása
        } catch (err) {
            setError("Nem sikerült betölteni a foglalásokat"); // Hibaüzenet beállítása
        }
    };

    // Adatok betöltése a komponens indulásakor
    useEffect(() => {
        fetchEmployees();
        fetchServices();
        fetchBookings();
        fetchUsers();
    }, []); // Ez csak egyszer fut le a komponens betöltődésekor

    // Új foglalás létrehozása
    const createBooking = async (e) => {
        e.preventDefault(); // Alapértelmezett űrlap submit elkerülése
        setError(""); // Hibák törlése

        try {
            const body = {
                ...newBooking,
                start_time: newBooking.start_time, // Új foglalás kezdési időpontja
            };

            // POST kérés a foglalás létrehozásához
            await axios.post("/api/bookings", body, { headers: authHeader });

            fetchBookings(); // Foglalások frissítése
            setNewBooking({
                user_id: "",
                service_id: "",
                employee_id: "",
                start_time: "",
            }); // Új foglalás után a form törlése

        } catch (err) {
            setError(err.response?.data?.error || "Foglalás sikertelen"); // Hibaüzenet beállítása
        }
    };

    // Foglalás státuszának módosítása
    const updateStatus = async (id, status) => {
        try {
            // PUT kérés a státusz módosításához
            await axios.put(`/api/bookings/${id}/status`, { status }, { headers: authHeader });
            fetchBookings(); // Foglalások frissítése
        } catch {
            alert("Hiba a státusz módosításakor"); // Hibaüzenet, ha a státusz módosítása nem sikerült
        }
    };

    return (
        <div className="admin-container container-lg"> {/* Admin konténer */}
            <AdminHeader title="Foglalások kezelése" /> {/* Admin fejléce */}

            {error && <div className="form-error">{error}</div>} {/* Hibák megjelenítése */}

            {/* Új foglalás űrlap */}
            <form onSubmit={createBooking} className="booking-form mt-3 mb-4" noValidate>
                <div className="row g-2">
                    {/* Ügyfél kiválasztása */}
                    <div className="col-md-3">
                        <select
                            value={newBooking.user_id}
                            onChange={(e) => setNewBooking({ ...newBooking, user_id: e.target.value })}
                        >
                            <option value="">Válassz ügyfelet</option> {/* Ügyfél kiválasztás */}
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Dolgozó kiválasztása */}
                    <div className="col-md-3">
                        <select
                            value={newBooking.employee_id}
                            onChange={(e) => setNewBooking({ ...newBooking, employee_id: e.target.value })}
                        >
                            <option value="">Válassz dolgozót</option> {/* Dolgozó kiválasztás */}
                            {employees.map(e => (
                                <option key={e.id} value={e.id}>{e.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Szolgáltatás kiválasztása */}
                    <div className="col-md-3">
                        <select
                            value={newBooking.service_id}
                            onChange={(e) => setNewBooking({ ...newBooking, service_id: e.target.value })}
                        >
                            <option value="">Válassz szolgáltatást</option> {/* Szolgáltatás kiválasztás */}
                            {services.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Kezdő időpont kiválasztása */}
                    <div className="col-md-2">
                        <input
                            type="datetime-local"
                            value={newBooking.start_time}
                            onChange={(e) => setNewBooking({ ...newBooking, start_time: e.target.value })}
                        />
                    </div>

                    {/* Felvitel gomb */}
                    <div className="col-md-1">
                        <button className="btn-success">Felvitel</button> {/* Új foglalás hozzáadása */}
                    </div>
                </div>
            </form>

            {/* Foglalások táblázata */}
            <table className="booking-table">
                <thead>
                    <tr>
                        <th>Ügyfél</th>
                        <th>Szolgáltatás</th>
                        <th>Dolgozó</th>
                        <th>Kezdés</th>
                        <th>Befejezés</th>
                        <th>Státusz</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((b) => (
                        <tr key={b.id}>
                            <td data-label="Ügyfél">{b.user_name}</td>
                            <td data-label="Szolgáltatás">{b.service_name}</td>
                            <td data-label="Dolgozó">{b.employee_name}</td>
                            <td data-label="Kezdés">{new Date(b.start_time).toLocaleString("hu-HU")}</td>
                            <td data-label="Befejezés">{new Date(b.end_time).toLocaleString("hu-HU")}</td>

                            <td data-label="Státusz" className="status-cell">
                                <span className={`status-dot ${b.status}`} />
                                {b.status === "pending" ? "Függőben" :
                                    b.status === "confirmed" ? "Jóváhagyva" : "Elutasítva"}
                            </td>

                            <td data-label="Műveletek" className="actions">
                                <div className="action-buttons">
                                    {b.status === "pending" && (
                                        <>
                                            <button className="btn-edit" onClick={() => updateStatus(b.id, "confirmed")}>
                                                Jóváhagyás
                                            </button>
                                            <button className="btn-delete" onClick={() => updateStatus(b.id, "cancelled")}>
                                                Elutasítás
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    );
}
