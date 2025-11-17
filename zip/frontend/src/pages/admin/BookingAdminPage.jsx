import { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../../components/AdminHeader";

export default function BookingAdminPage() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");

    const fetchBookings = async () => {
        try {
            const res = await axios.get("/api/bookings");
            setBookings(res.data);
        } catch (err) {
            setError("Nem sikerült betölteni a foglalásokat");
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`/api/bookings/${id}/status`, { status });
            await fetchBookings(); // frissítjük a listát
        } catch (err) {
            alert("Hiba a státusz módosításakor");
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    return (
        <div className="container mt-4">
            <AdminHeader title="Foglalások" />
            {error && <div className="alert alert-danger mt-3">{error}</div>}

            <table className="table table-striped mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Felhasználó</th>
                        <th>Szolgáltatás</th>
                        <th>Dolgozó</th>
                        <th>Kezdés</th>
                        <th>Befejezés</th>
                        <th>Státusz</th>
                        <th>Művelet</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((b) => (
                        <tr key={b.id}>
                            <td>{b.id}</td>
                            <td>{b.user_name}</td>
                            <td>{b.service_name}</td>
                            <td>{b.employee_name}</td>
                            <td>{new Date(b.start_time).toLocaleString()}</td>
                            <td>{new Date(b.end_time).toLocaleString()}</td>
                            <td>
                                <span
                                    className={
                                        b.status === "confirmed"
                                            ? "badge bg-success"
                                            : b.status === "cancelled"
                                                ? "badge bg-danger"
                                                : "badge bg-warning text-dark"
                                    }
                                >
                                    {b.status}
                                </span>
                            </td>
                            <td>
                                {b.status === "pending" && (
                                    <>
                                        <button
                                            onClick={() => updateStatus(b.id, "confirmed")}
                                            className="btn btn-success btn-sm me-2"
                                        >
                                            ✅ Jóváhagyás
                                        </button>
                                        <button
                                            onClick={() => updateStatus(b.id, "cancelled")}
                                            className="btn btn-danger btn-sm"
                                        >
                                            ❌ Elutasítás
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
