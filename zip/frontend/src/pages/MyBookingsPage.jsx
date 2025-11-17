import { useEffect, useState } from "react";
import axios from "axios";

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get("/api/bookings/my");
                setBookings(res.data);
            } catch (err) {
                setError("Nem sikerült betölteni a foglalásokat.");
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    if (loading) return <p>Betöltés...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <h2>🗓 Saját foglalásaim</h2>

            {bookings.length === 0 ? (
                <p className="text-muted mt-3">Nincs még foglalásod.</p>
            ) : (
                <table className="table table-striped mt-3 align-middle">
                    <thead>
                        <tr>
                            <th>#</th>
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
                                <td>{b.id}</td>
                                <td>{b.service_name}</td>
                                <td>{b.employee_name}</td>
                                <td>{new Date(b.start_time).toLocaleString("hu-HU")}</td>
                                <td>{new Date(b.end_time).toLocaleString("hu-HU")}</td>
                                <td>
                                    <span
                                        className={
                                            b.status === "confirmed"
                                                ? "badge bg-success"
                                                : b.status === "pending"
                                                    ? "badge bg-warning text-dark"
                                                    : "badge bg-danger"
                                        }
                                    >
                                        {b.status === "confirmed"
                                            ? "Jóváhagyva"
                                            : b.status === "pending"
                                                ? "Függőben"
                                                : "Elutasítva"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
