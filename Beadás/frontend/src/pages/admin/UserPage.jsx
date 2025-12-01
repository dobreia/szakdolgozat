// src/pages/admin/UsersPage.jsx
import { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";

import "../../styles/users.css";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: "", email: "", role: "user" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState(null);

    const token = localStorage.getItem("token");
    const authHeader = token ? { Authorization: "Bearer " + token } : {};

    const fetchUsers = async () => {
        setError(null);
        try {
            const res = await fetch("/api/users", { headers: { ...authHeader } });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Nem sikerült betölteni a felhasználókat.");
            }

            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async (e) => {
        e.preventDefault();
        setFormError(null);

        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeader,
                },
                body: JSON.stringify({
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    password: newUser.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Hozzáadás sikertelen.");
            }

            await fetchUsers();
            setNewUser({ name: "", email: "", role: "user", password: "" });

        } catch (err) {
            setFormError(err.message);
        }
    };


    const handleUpdateRole = async (id, role) => {
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeader },
                body: JSON.stringify({ role }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Módosítás sikertelen.");
            }

            await fetchUsers();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Biztosan törlöd a felhasználót?")) return;

        try {
            const res = await fetch(`/api/users/${id}`, {
                method: "DELETE",
                headers: { ...authHeader },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Törlés sikertelen.");
            }

            await fetchUsers();
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <p>Betöltés...</p>;

    if (error) {
        return (
            <div className="admin-container container-lg">
                <AdminHeader title="Felhasználók" />
                <p className="text-danger text-center mt-3">{error}</p>
            </div>
        );
    }

    return (
        <div className="admin-container container-lg">
            <AdminHeader title="Felhasználók" />

            {/* Új felhasználó űrlap */}
            <form onSubmit={handleAddUser} className="users-form mt-3 mb-4" noValidate>
                <div className="row g-2">
                    <div className="col-md-3">
                        <input
                            type="text"
                            placeholder="Név"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            
                        />
                    </div>

                    <div className="col-md-3">
                        <input
                            type="email"
                            placeholder="Email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            
                        />
                    </div>

                    <div className="col-md-3">
                        <input
                            type="password"
                            placeholder="Jelszó"
                            value={newUser.password || ""}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            
                        />
                    </div>

                    <div className="col-md-2">
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="col-md-1">
                        <button type="submit" className="btn-success">OK</button>
                    </div>
                </div>
            </form>


            {formError && <p className="form-error">{formError}</p>}

            {/* Táblázat */}
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Név</th>
                        <th>Email</th>
                        <th>Szerep</th>
                        <th className="text-center">Műveletek</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td className="text-left">{u.name}</td>
                            <td className="text-left">{u.email}</td>
                            <td className="text-center">
                                <select
                                    value={u.role}
                                    onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                                    className="role-select"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                            <td className="actions-centered">
                                {u.id !== JSON.parse(localStorage.getItem("user"))?.id && (
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(u.id)}
                                    >
                                        Törlés
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
