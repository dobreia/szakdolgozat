import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import profileIcon from "../assets/icons/profile.svg";
import "../styles/navbar.css";

export default function Navbar({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-lg d-flex justify-content-between align-items-center">
                {/* Bal oldalt: márkanév */}
                <Link className="navbar-brand fw-semibold" to="/">
                    Varázs Szépségszalon
                </Link>
                {/* Navigációs linkek (összecsukható rész) */}
                <div className="collapse navbar-collapse" id="mainNavbar">
                    <ul className="navbar-nav ms-3 mb-2 mb-lg-0">
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
                {/* Jobb oldal: profil + hamburger ikon egymás mellett */}
                <div className="d-flex align-items-center gap-2">
                    {/* Profil dropdown */}
                    <div className="dropdown me-2">
                        <button
                            className="btn btn-dark dropdown-toggle d-flex align-items-center"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <img src={profileIcon} alt="Profil" className="profile-icon" />
                        </button>



                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark">
                            {!user ? (
                                <>
                                    <li>
                                        <Link to="/login" className="dropdown-item">
                                            Bejelentkezés
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/register" className="dropdown-item">
                                            Regisztráció
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <div className="dropdown-item-text">
                                            {user.name} ({user.role})
                                        </div>
                                    </li>
                                    {user.role === "admin" && (
                                        <li>
                                            <Link to="/admin" className="dropdown-item">
                                                Admin felület
                                            </Link>
                                        </li>
                                    )}
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                        <button
                                            className="dropdown-item text-danger"
                                            onClick={handleLogout}
                                        >
                                            Kijelentkezés
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Hamburger ikon */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#mainNavbar"
                        aria-controls="mainNavbar"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
            </div>


        </nav>
    );
}
