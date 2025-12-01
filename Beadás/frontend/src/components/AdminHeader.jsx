import { useNavigate } from "react-router-dom";
import "../styles/adminHeader.css"; 

export default function AdminHeader({ title }) {
    const navigate = useNavigate(); // A navigate hook inicializálása

    return (
        <div className="admin-header"> {/* Admin fejléc konténer */}
            <button onClick={() => navigate("/admin")}>← Vissza</button> {/* Vissza gomb, navigálás az admin oldalra */}
            <h2>{title}</h2> {/* Az oldal címe, amit a parent komponens ad át */}
        </div>
    );
}
