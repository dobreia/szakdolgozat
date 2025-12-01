import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import "../styles/booking-public.css";

export default function BookingPage() {

  // Query paraméterek beolvasása (pl.: ?service=2 → defaultService = 2)
  const [searchParams] = useSearchParams();
  const defaultService = searchParams.get("service") || "";

  // Szolgáltatások és dolgozók listái
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Foglalási űrlap adatai
  const [form, setForm] = useState({
    service_id: defaultService,
    employee_id: "",
    date: ""
  });

  // Felhasználói visszajelzés
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Oldalbetöltéskor lekérjük a szükséges adatokat
  useEffect(() => {
    const loadData = async () => {
      try {
        // Párhuzamos adatlekérés: szolgáltatások + dolgozók
        const [s, e] = await Promise.all([
          axios.get("/api/services"),
          axios.get("/api/employees")
        ]);
        setServices(s.data);
        setEmployees(e.data);
      } catch {
        // Hiba esetén hibaüzenet
        setMessage("Nem sikerült betölteni az adatokat.");
      }
    };
    loadData();
  }, []); // üres dependency → csak egyszer fut

  // Bármely űrlapmező változását kezelő függvény
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Foglalás elküldése backend felé
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Bejelentkezett felhasználó kiolvasása localStorage-ból
      const user = JSON.parse(localStorage.getItem("user"));

      // Foglalás POST request
      await axios.post("/api/bookings", {
        user_id: user.id,
        service_id: form.service_id,
        employee_id: form.employee_id,
        start_time: form.date
      });

      // Sikeres eset: visszajelzés + űrlap reset
      setMessage("A foglalás sikeresen leadva!");
      setIsSuccess(true);
      setForm({ service_id: "", employee_id: "", date: "" });
    } catch (err) {
      // Backend által küldött hibaüzenet, vagy általános hiba
      setMessage(err.response?.data?.error || "A foglalás nem sikerült. Kérjük próbálja meg újra.");
      setIsSuccess(false);
    }
  };

  return (
    <div className="booking-container">
      <h2>Időpont foglalása</h2>

      {/* Foglalási űrlap */}
      <form onSubmit={handleSubmit}>

        {/* Szolgáltatás választás */}
        <select name="service_id" value={form.service_id} onChange={handleChange}>
          <option value="">Válassz szolgáltatást</option>
          {services.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Dolgozó választás */}
        <select name="employee_id" value={form.employee_id} onChange={handleChange}>
          <option value="">Válassz dolgozót</option>
          {employees.map(e => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>

        {/* Időpont kiválasztása */}
        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
        />

        {/* Foglalás elküldése */}
        <button type="submit" className="btn-book-submit">
          Foglalás leadása
        </button>

        {/* Visszajelző üzenet */}
        {message && (
          <p className={`booking-message ${isSuccess ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
