import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import "../styles/booking-public.css";

export default function BookingPage() {

  const [searchParams] = useSearchParams();
  const defaultService = searchParams.get("service") || "";

  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    service_id: defaultService,
    employee_id: "",
    date: ""
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [s, e] = await Promise.all([
          axios.get("/api/services"),
          axios.get("/api/employees")
        ]);
        setServices(s.data);
        setEmployees(e.data);
      } catch {
        setMessage("Nem sikerült betölteni az adatokat.");
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await axios.post("/api/bookings", {
        user_id: user.id,
        service_id: form.service_id,
        employee_id: form.employee_id,
        start_time: form.date
      });

      setMessage("A foglalás sikeresen leadva!");
      setIsSuccess(true);
      setForm({ service_id: "", employee_id: "", date: "" });
    } catch (err) {
      setMessage(err.response?.data?.error || "Hiba történt!");
      setIsSuccess(false);
    }
  };

  return (
    <div className="booking-container">
      <h2>Időpont foglalása</h2>

      <form onSubmit={handleSubmit}>
        <select name="service_id" value={form.service_id} onChange={handleChange}>
          <option value="">Válassz szolgáltatást</option>
          {services.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select name="employee_id" value={form.employee_id} onChange={handleChange}>
          <option value="">Válassz dolgozót</option>
          {employees.map(e => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>

        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
        />

        <button type="submit" className="btn-book-submit">
          Foglalás leadása
        </button>

        {message && (
          <p className={`booking-message ${isSuccess ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
