import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";

import "../../styles/services.css";
import "../../styles/global.css";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);

  const [newEmployee, setNewEmployee] = useState({ name: "", email: "" });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        setErrorStatus(401);
        setError("A dolgozók megtekintéséhez be kell jelentkezned.");
        return;
      }

      if (res.status === 403) {
        setErrorStatus(403);
        setError("Nincs admin jogosultságod az oldal megtekintéséhez.");
        return;
      }

      if (!res.ok) throw new Error("Hiba történt az adatbetöltés során.");

      const data = await res.json();
      setEmployees(data);

    } catch (err) {
      setError("Hiba történt az adatbetöltés során.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEmployee),
      });

      if (res.status === 403) {
        alert("Nincs jogosultságod alkalmazottat hozzáadni!");
        return;
      }
      if (!res.ok) throw new Error("Hozzáadás sikertelen.");

      await fetchEmployees();
      setNewEmployee({ name: "", email: "" });

    } catch (err) {
      alert("Hiba: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Biztosan törlöd a dolgozót?")) return;

    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 403) {
        alert("Nincs jogosultságod törölni!");
        return;
      }
      if (!res.ok) throw new Error("Törlés sikertelen.");

      await fetchEmployees();

    } catch (err) {
      alert("Hiba: " + err.message);
    }
  };

  if (loading) return <p>Betöltés...</p>;

  if (error) {
    return (
      <div className="admin-container container-lg text-center mt-4">
        <AdminHeader title="Dolgozók" />

        <p className="text-danger fw-bold mb-3">{error}</p>

        {errorStatus === 401 && (
          <button
            className="btn btn-primary"
            onClick={() => navigate("/login")}
          >
            Bejelentkezés
          </button>
        )}

        {errorStatus === 403 && (
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/")}
          >
            Vissza a főoldalra
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="admin-container">
      <AdminHeader title="Dolgozók" />

      <form onSubmit={handleAddEmployee} className="service-form mt-3 mb-4 d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Név"
          value={newEmployee.name}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, name: e.target.value })
          }
          required
        />
        <input
          type="email"
          className="form-control"
          placeholder="Email"
          value={newEmployee.email}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, email: e.target.value })
          }
          required
        />
        <button type="submit" className="btn btn-success">
          Hozzáadás
        </button>
      </form>

      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Név</th>
            <th>Email</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.name}</td>
              <td>{e.email}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(e.id)}
                >
                  Törlés
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
