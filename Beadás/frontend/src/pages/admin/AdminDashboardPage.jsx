import { Link } from "react-router-dom";
import "../../styles/adminDashboard.css"; 

export default function AdminDashboard() {
    return (
        <div className="container mt-5 admin-dashboard"> {/* Admin felület konténer */}
            <h1 className="text-center">Admin felület</h1> {/* Admin felület címe */}
            <h2 className="text-center mb-4">Innen elérheted és kezelheted a rendszer fő elemeit</h2> {/* Részletes leírás */}
            <div className="row g-4 justify-content-center"> {/* A kártyák elrendezése (rács) */}

                {/* Szolgáltatások kártya */}
                <div className="col-md-5 col-lg-4">
                    <Link to="/admin/services" className="admin-card card text-center p-4"> {/* Link a Szolgáltatások kezelése oldalra */}
                        <h4>Szolgáltatások kezelése</h4>
                        <p>Szolgáltatások hozzáadása, módosítása, törlése</p> {/* Szolgáltatások leírása */}
                    </Link>
                </div>

                {/* Foglalások kártya */}
                <div className="col-md-5 col-lg-4">
                    <Link to="/admin/bookings" className="admin-card card text-center p-4"> {/* Link a Foglalások oldalra */}
                        <h4>Foglalások</h4>
                        <p className="text-muted">Időpontok megtekintése, jóváhagyás, elutasítás</p> {/* Foglalások leírása */}
                    </Link>
                </div>

                {/* Felhasználók kártya */}
                <div className="col-md-5 col-lg-4">
                    <Link to="/admin/users" className="admin-card card text-center p-4"> {/* Link a Felhasználók oldalra */}
                        <h4>Felhasználók</h4>
                        <p className="text-muted">Regisztrált felhasználók listája és szerepkörök</p> {/* Felhasználók leírása */}
                    </Link>
                </div>

                {/* Munkatársak kártya */}
                <div className="col-md-5 col-lg-4">
                    <Link to="/admin/employees" className="admin-card card text-center p-4"> {/* Link a Munkatársak kezelése oldalra */}
                        <h4>Munkatársak kezelése</h4>
                        <p className="text-muted">Munkatársak adatainak kezelése</p> {/* Munkatársak leírása */}
                    </Link>
                </div>
            </div>
        </div>
    );
}
