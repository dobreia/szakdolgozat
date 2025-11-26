import { Link, useNavigate, useLocation } from "react-router-dom";
import profileIcon from "../assets/icons/profile.svg";
import "../styles/navbar.css";

export default function Navbar({ user, setUser }) {
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === "/";

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        navigate("/");
    };

    return (
        <nav className={`navbar navbar-expand-lg ${isHome ? "navbar-transparent" : ""}`}>
            <div className="container-lg d-flex align-items-center">

                {/* Brand */}
                <Link className="navbar-brand fw-semibold me-auto" to="/">
                    Varázs Szépségszalon
                </Link>

                {/* Profil + hamburger — mindig jobb felső sarokban */}
                <div className="d-flex align-items-center gap-2 order-lg-2">

                    {/* Profil ikon dropdown */}
                    <div className="dropdown">
                        <button
                            className="btn profile-btn dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <img src={profileIcon} alt="Profil" className="profile-icon" />
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end">
                            {!user ? (
                                <>
                                    <li><Link to="/login" className="dropdown-item">Bejelentkezés</Link></li>
                                    <li><Link to="/register" className="dropdown-item">Regisztráció</Link></li>
                                </>
                            ) : (
                                <>
                                    <li className="dropdown-item-text fw-semibold">
                                        {user.name} ({user.role})
                                    </li>
                                    {user.role === "admin" && (
                                        <li><Link to="/admin" className="dropdown-item">Admin felület</Link></li>
                                    )}
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="dropdown-item text-danger" onClick={handleLogout}>
                                            Kijelentkezés
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Hamburger csak annál, akinek van menüje */}
                    {(!user || user.role === "user") && (
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#mainNavbar"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    )}
                </div>

                {/* Menü linkek — külön collapsel */}
                {(!user || user.role === "user") && (
                    <div className="collapse navbar-collapse order-lg-1" id="mainNavbar">
                        <ul className="navbar-nav ms-lg-3 mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to="/" className="nav-link">Főoldal</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/services" className="nav-link">Szolgáltatások</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/booking" className="nav-link">Időpontfoglalás</Link>
                            </li>
                            {user && (
                                <li className="nav-item">
                                    <Link to="/my-bookings" className="nav-link">Saját foglalásaim</Link>
                                </li>
                            )}
                        </ul>
                    </div>
                )}

            </div>
        </nav>
    );
}
