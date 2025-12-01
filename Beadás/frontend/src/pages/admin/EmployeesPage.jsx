import { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import "../../styles/employees.css";

export default function EmployeesPage() {
  // Állapotváltozók a dolgozók, hibaüzenetek és betöltés kezelésére
  const [employees, setEmployees] = useState([]); // Dolgozók listája
  const [loading, setLoading] = useState(true); // Betöltés állapota
  const [error, setError] = useState(null); // Hibaüzenet
  const [formError, setFormError] = useState(null); // Űrlap hibaüzenet

  // Új alkalmazott adatainak állapota
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
  });

  const token = localStorage.getItem("token"); // Autentikációs token lekérése

  // Munkatársak betöltése
  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Betöltési hiba"); // Hiba, ha a válasz nem sikeres

      const data = await res.json();
      setEmployees(data); // Dolgozók beállítása
    } catch {
      setError("Hiba történt a dolgozók betöltése során."); // Hibaüzenet beállítása
    } finally {
      setLoading(false); // Betöltés befejezése
    }
  };

  // Használatkor betölti a munkatársakat
  useEffect(() => {
    fetchEmployees(); // Betölti a munkatársakat a komponens indulásakor
  }, []); // Csak egyszer fut le

  // Új dolgozó hozzáadása
  const handleAddEmployee = async (e) => {
    e.preventDefault(); // Alapértelmezett form submit letiltása
    setFormError(null); // Hiba törlése

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // JSON body küldése
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEmployee), // Új alkalmazott adatainak küldése
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Hozzáadás sikertelen"); // Hibaüzenet beállítása
        return;
      }

      setNewEmployee({ name: "", email: "" }); // Form törlése új alkalmazott hozzáadása után
      fetchEmployees(); // Dolgozók frissítése
    } catch {
      setFormError("Hálózati hiba történt!"); // Hálózati hiba üzenet
    }
  };

  // Dolgozó törlésének kezelése
  const handleDelete = async (id) => {
    if (!window.confirm("Biztosan törlöd?")) return; // Kérdés a törlés előtt

    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Törlés sikertelen");

      fetchEmployees(); // Dolgozók frissítése törlés után
    } catch {
      alert("A törlés nem sikerült!"); // Törlés hibaüzenet
    }
  };

  if (loading) return <p>Betöltés...</p>; // Betöltés közbeni üzenet
  if (error) return <p className="text-danger text-center">{error}</p>; // Hibaüzenet megjelenítése

  return (
    <div className="admin-container container-lg"> {/* Admin konténer */}
      <AdminHeader title="Munkatársak" /> {/* Admin fejléc */}
      {formError && <p className="form-error">{formError}</p>} {/* Form hibaüzenet */}

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
              className={formError ? "input-error" : ""} // Hibás input esetén stílus
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
              className={formError ? "input-error" : ""} // Hibás input esetén stílus
            />
          </div>

          <div className="col-md-4">
            <button type="submit" className="btn-success">
              Hozzáadás
            </button> {/* Új alkalmazott hozzáadása */}
          </div>
        </div>
      </form>

      {/* Dolgozók táblázata */}
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
                </button> {/* Törlés gomb */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
