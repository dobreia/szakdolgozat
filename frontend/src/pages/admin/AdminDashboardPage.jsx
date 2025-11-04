import { Link } from "react-router-dom";
import "../../styles/adminDashboard.css";

export default function AdminDashboard() {
    return (
        <div className="container mt-5 admin-dashboard">
            <h2 className="mb-4 text-center">Admin felület</h2>
            <p className="text-muted text-center mb-4">
                Innen elérheted és kezelheted a rendszer fő elemeit.
            </p>

            <div className="row g-4 justify-content-center">
                {/* Szolgáltatások */}
                <div className="col-md-5 col-lg-4">
                    <Link to="/admin/services" className="admin-card card text-center p-4">
                        <h4>💅 Szolgáltatások kezelése</h4>
                        <p className="text-muted">Szolgáltatások hozzáadása, módosítása, törlése</p>
                    </Link>
                </div>

                {/* Munkatársak */}
                <div className="col-md-5 col-lg-4">
                    <Link to="/admin/employees" className="admin-card card text-center p-4">
                        <h4>👥 Munkatársak kezelése</h4>
                        <p className="text-muted">Munkatársak adatainak kezelése</p>
                    </Link>
                </div>

                {/* Foglalások */}
                <div className="col-md-5 col-lg-4">
                    <Link to="/admin/bookings" className="admin-card card text-center p-4">
                        <h4>📅 Foglalások</h4>
                        <p className="text-muted">Időpontok megtekintése, jóváhagyás, elutasítás</p>
                    </Link>
                </div>

                {/* Felhasználók */}
                <div className="col-md-5 col-lg-4">
                    <Link to="/admin/users" className="admin-card card text-center p-4">
                        <h4>👤 Felhasználók</h4>
                        <p className="text-muted">Regisztrált felhasználók listája és szerepkörök</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
