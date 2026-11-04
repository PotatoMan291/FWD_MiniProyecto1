const opciones = [
  { id: "dashboard", nombre: "Dashboard", icono: "▦" },
  { id: "productos", nombre: "Productos", icono: "▣" },
  { id: "categorias", nombre: "Categorías", icono: "◈" },
  { id: "proveedores", nombre: "Proveedores", icono: "◇" },
  { id: "empleados", nombre: "Empleados", icono: "♙" },
  { id: "movimientos", nombre: "Inventario", icono: "⇄" },
];

export default function Sidebar({ seccion, cambiarSeccion }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">G</div>
        <div>
          <h2>GameVault</h2>
          <span>Inventory System</span>
        </div>
      </div>

      <p className="menu-label">MENÚ PRINCIPAL</p>

      <nav>
        {opciones.map((opcion) => (
          <button
            key={opcion.id}
            className={`nav-item ${seccion === opcion.id ? "active" : ""}`}
            onClick={() => cambiarSeccion(opcion.id)}
          >
            <span className="nav-icon">{opcion.icono}</span>
            {opcion.nombre}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="status-dot"></span>
        Sistema operativo
      </div>
    </aside>
  );
}
