import { useNavigate } from "react-router-dom";
import "../styles/adminHeader.css";

export default function AdminHeader({ title }) {
    const navigate = useNavigate();
    return (
        <div className="admin-header">
            <button onClick={() => navigate("/admin")}>← Vissza</button>
            <h2>{title}</h2>
        </div >
    );
}
