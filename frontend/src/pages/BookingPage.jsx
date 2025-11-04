import { useEffect, useState } from "react";
import axios from "axios";

export default function BookingPage() {
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    service_id: "",
    employee_id: "",
    date: "",
  });
  const [message, setMessage] = useState("");

  // szolgáltatások + dolgozók betöltése
  useEffect(() => {
    const loadData = async () => {
      const [s, e] = await Promise.all([
        axios.get("/api/services"),
        axios.get("/api/employees"),
      ]);
      setServices(s.data);
      setEmployees(e.data);
    };
    loadData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user")); // bejelentkezett user

      await axios.post("/api/bookings", {
        user_id: user.id,
        service_id: form.service_id,
        employee_id: form.employee_id,
        date: form.date, // pl. 2025-11-04T10:30
      });

      setMessage("✅ Sikeres foglalás! Köszönjük.");
      setForm({ service_id: "", employee_id: "", date: "" });
    } catch (err) {
      setMessage("❌ Hiba: " + (err.response?.data?.error || "Ismeretlen hiba"));
    }
  };

  return (
    <div className="container mt-5">
      <h2>Időpontfoglalás</h2>
      <form onSubmit={handleSubmit} className="booking-form mt-3">

        <select
          name="service_id"
          className="form-select mb-2"
          value={form.service_id}
          onChange={handleChange}
          required
        >
          <option value="">Válassz szolgáltatást</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select
          name="employee_id"
          className="form-select mb-2"
          value={form.employee_id}
          onChange={handleChange}
          required
        >
          <option value="">Válassz dolgozót</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>

        <input
          name="date"
          type="datetime-local"
          className="form-control mb-3"
          value={form.date}
          onChange={handleChange}
          required
          min={new Date().toISOString().slice(0, 16)} // csak jövőbeli időpont
        />

        <button type="submit" className="btn btn-primary w-100">Foglalás küldése</button>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
