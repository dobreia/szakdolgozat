import { Link, useNavigate, useLocation } from "react-router-dom";
import profileIcon from "../assets/icons/profile.svg";
import "../styles/navbar.css";

export default function Navbar({ user, setUser }) {
    const navigate = useNavigate(); // A navigate hook inicializálása navigáláshoz
    const location = useLocation(); // Az aktuális hely lekérése
    const isHome = location.pathname === "/"; // Ellenőrizzük, hogy a felhasználó a főoldalon van-e
    const isAdminRoute = location.pathname.includes("/admin"); // Ellenőrizzük, hogy admin oldalon vagyunk-e

    // Kijelentkezés kezelése: töröljük a localStorage adatokat és a felhasználót
    const handleLogout = () => {
        localStorage.clear(); // Töröljük a localStorage-t
        setUser(null); // A user állapotot null-ra állítjuk
        navigate("/"); // A felhasználót a főoldalra navigáljuk
    };

    return (
        <nav className={`navbar navbar-expand-lg ${isHome ? "navbar-transparent" : ""} ${isAdminRoute ? "navbar-admin" : ""}`}> {/* Admin oldal esetén navbar-admin osztály */}
            <div className="container-lg d-flex align-items-center">

                {/* Brand (szalon neve) */}
                <Link className="navbar-brand fw-semibold me-auto" to="/">
                    Varázs Szépségszalon
                </Link>

                {/* Profil ikon és hamburger menü — mindig jobb felső sarokban */}
                <div className="d-flex align-items-center gap-2 order-lg-2">

                    {/* Profil ikon dropdown */}
                    <div className="dropdown">
                        <button
                            className="btn profile-btn dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <img src={profileIcon} alt="Profil" className="profile-icon" /> {/* Profil ikon */}
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end">
                            {/* Ha nincs bejelentkezve felhasználó */}
                            {!user ? (
                                <>
                                    <li><Link to="/login" className="dropdown-item">Bejelentkezés</Link></li> {/* Bejelentkezés link */}
                                    <li><Link to="/register" className="dropdown-item">Regisztráció</Link></li> {/* Regisztráció link */}
                                </>
                            ) : (
                                <>
                                    {/* Bejelentkezett felhasználó neve és szerepköre */}
                                    <li className="dropdown-item-text fw-semibold">
                                        {user.name} ({user.role})
                                    </li>
                                    {/* Ha admin, akkor az admin felület link megjelenítése */}
                                    {user.role === "admin" && (
                                        <li><Link to="/admin" className="dropdown-item">Admin felület</Link></li>
                                    )}
                                    <li><hr className="dropdown-divider" /></li>
                                    {/* Kijelentkezés gomb */}
                                    <li>
                                        <button className="dropdown-item text-danger" onClick={handleLogout}>
                                            Kijelentkezés
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Hamburger menü, ha nincs bejelentkezve felhasználó vagy ha a felhasználó nem admin */}
                    {(!user || user.role === "user") && (
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#mainNavbar"
                        >
                            <span className="navbar-toggler-icon"></span> {/* Hamburger ikont megjelenítő gomb */}
                        </button>
                    )}
                </div>

                {/* Menü linkek — külön collapsel */}
                {(!user || user.role === "user") && (
                    <div className="collapse navbar-collapse order-lg-1" id="mainNavbar">
                        <ul className="navbar-nav ms-lg-3 mb-2 mb-lg-0">
                            {/* Főoldal link */}
                            <li className="nav-item">
                                <Link to="/" className="nav-link">Főoldal</Link>
                            </li>
                            {/* Szolgáltatások link */}
                            <li className="nav-item">
                                <Link to="/services" className="nav-link">Szolgáltatások</Link>
                            </li>
                            {/* Ha be van jelentkezve a felhasználó */}
                            {user && (
                                <>
                                    {/* Időpontfoglalás link */}
                                    <li className="nav-item">
                                        <Link to="/booking" className="nav-link">Időpontfoglalás</Link>
                                    </li>
                                    {/* Saját foglalások link */}
                                    <li className="nav-item">
                                        <Link to="/my-bookings" className="nav-link">Saját foglalásaim</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                )}

            </div>
        </nav>
    );
}
