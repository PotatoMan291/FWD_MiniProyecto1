import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ManagementPage from "./pages/ManagementPage";

import { useAuth } from "./context/AuthContext";

import "./index.css";

const nombresSecciones = {
  dashboard: "Dashboard",
  productos: "Productos",
  categorias: "Categorías",
  proveedores: "Proveedores",
  empleados: "Empleados",
  movimientos: "Inventario",
};

export default function App() {
  const [seccion, setSeccion] = useState("dashboard");

  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const manejarCerrarSesion = () => {
    cerrarSesion();
    navigate("/login", { replace: true });
  };

  const iniciales = usuario?.nombre
    ? usuario.nombre
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte[0].toUpperCase())
        .join("")
    : "GV";

  return (
    <div className="app-layout">
      <Sidebar seccion={seccion} cambiarSeccion={setSeccion} />

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="topbar-label">GAMEVAULT</span>
            <span className="topbar-divider">/</span>
            <span>{nombresSecciones[seccion]}</span>
          </div>

          <div className="user-profile">
            <div className="avatar">{iniciales}</div>

            <div className="user-profile-info">
              <strong>{usuario?.nombre || "Usuario"}</strong>
              <span>{usuario?.correo || "Cuenta autenticada"}</span>
            </div>

            <button
              type="button"
              className="logout-button"
              onClick={manejarCerrarSesion}
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <div className="content">
          {seccion === "dashboard" ? (
            <Dashboard />
          ) : (
            <ManagementPage seccion={seccion} />
          )}
        </div>
      </main>
    </div>
  );
}
