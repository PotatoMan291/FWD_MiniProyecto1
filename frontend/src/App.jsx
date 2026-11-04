import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ManagementPage from "./pages/ManagementPage";

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
            <div className="avatar">GV</div>

            <div>
              <strong>Administrador</strong>
              <span>Inventario</span>
            </div>
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
