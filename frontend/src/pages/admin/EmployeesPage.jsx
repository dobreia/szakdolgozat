import { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import "../../styles/employees.css";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
  });

  const token = localStorage.getItem("token");

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Betöltési hiba");

      const data = await res.json();
      setEmployees(data);
    } catch {
      setError("Hiba történt a dolgozók betöltése során.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setFormError(null);

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEmployee),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Hozzáadás sikertelen");
        return;
      }

      setNewEmployee({ name: "", email: "" });
      fetchEmployees();
    } catch {
      setFormError("Hálózati hiba történt!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Biztosan törlöd?")) return;

    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Törlés sikertelen");

      fetchEmployees();
    } catch {
      alert("A törlés nem sikerült!");
    }
  };

  if (loading) return <p>Betöltés...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div className="admin-container container-lg">
      <AdminHeader title="Dolgozók" />
      {formError && <p className="form-error">{formError}</p>}
      {/* Új alkalmazott űrlap */}
      <form onSubmit={handleAddEmployee} className="employee-form mt-3 mb-4" noValidate>
        <div className="row g-2">
          <div className="col-md-4">
            <input
              type="text"
              placeholder="Név"
              value={newEmployee.name}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, name: e.target.value })
              }
              className={formError ? "input-error" : ""}
            />
          </div>

          <div className="col-md-4">
            <input
              type="email"
              placeholder="Email"
              value={newEmployee.email}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, email: e.target.value })
              }
              className={formError ? "input-error" : ""}
            />
          </div>

          <div className="col-md-4">
            <button type="submit" className="btn-success">
              Hozzáadás
            </button>
          </div>
        </div>
      </form>


      {/* Dolgozók táblázat */}
      <table className="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Név</th>
            <th>Email</th>
            <th className="text-center">Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td className="text-left">{e.name}</td>
              <td className="text-left">{e.email}</td>
              <td className="actions-centered">
                <button
                  className="btn-delete"
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
