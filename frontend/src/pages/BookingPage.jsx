// BookingPage.jsx – Foglalási űrlap
// A komponens a szolgáltatásokat és dolgozókat a backend API-ból tölti be,
// majd elküldi a POST /api/bookings kérést a foglalás rögzítéséhez.

import { useEffect, useState } from "react";
import axios from "axios";

export default function BookingPage() {

  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    service_id: "",
    employee_id: "",
    date: ""
  });

  const [message, setMessage] = useState("");

  // Szolgáltatások és dolgozók lekérdezése
  useEffect(() => {
    const loadData = async () => {
      const [s, e] = await Promise.all([
        axios.get("/api/services"),
        axios.get("/api/employees")
      ]);
      setServices(s.data);
      setEmployees(e.data);
    };
    loadData();
  }, []);

  // Űrlap mező frissítése
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Foglalás elküldése a backendnek
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await axios.post("/api/bookings", {
        user_id: user.id,
        service_id: form.service_id,
        employee_id: form.employee_id,
        date: form.date
      });

      setMessage("Sikeres foglalás!");
      setForm({ service_id: "", employee_id: "", date: "" });

    } catch (err) {
      setMessage(
        "Hiba: " + (err.response?.data?.error || "Ismeretlen hiba történt")
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Szolgáltatás kiválasztása */}
      <select name="service_id" value={form.service_id} onChange={handleChange}>
        <option value="">Válassz szolgáltatást</option>
        {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>

      {/* Dolgozó kiválasztása */}
      <select name="employee_id" value={form.employee_id} onChange={handleChange}>
        <option value="">Válassz dolgozót</option>
        {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
      </select>

      {/* Dátum-idő kiválasztása */}
      <input
        type="datetime-local"
        name="date"
        value={form.date}
        onChange={handleChange}
      />

      <button type="submit">Foglalás</button>

      {message && <p>{message}</p>}
    </form>
  );
}
