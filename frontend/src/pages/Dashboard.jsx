import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard")
      .then((respuesta) => setDatos(respuesta.data))
      .catch(() => setError("No se pudo cargar el dashboard."));
  }, []);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!datos) {
    return <p>Cargando dashboard...</p>;
  }

  const tarjetas = [
    {
      titulo: "Videojuegos",
      valor: datos.totalProductos,
      icono: "▣",
    },
    {
      titulo: "Categorías",
      valor: datos.totalCategorias,
      icono: "◈",
    },
    {
      titulo: "Proveedores",
      valor: datos.totalProveedores,
      icono: "◇",
    },
    {
      titulo: "Empleados",
      valor: datos.totalEmpleados,
      icono: "♙",
    },
    {
      titulo: "Movimientos",
      valor: datos.totalMovimientos,
      icono: "⇄",
    },
  ];

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">RESUMEN GENERAL</p>
          <h1>Dashboard</h1>
          <p className="page-description">
            Bienvenido al sistema de inventario GameVault.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        {tarjetas.map((tarjeta) => (
          <article className="stat-card" key={tarjeta.titulo}>
            <div className="stat-top">
              <span>{tarjeta.titulo}</span>
              <span className="stat-icon">{tarjeta.icono}</span>
            </div>

            <strong>{tarjeta.valor}</strong>
          </article>
        ))}
      </div>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Productos con stock bajo</h2>
            <p>Productos que necesitan reposición.</p>
          </div>
        </div>

        {datos.productosStockBajo.length === 0 ? (
          <p className="empty-state">No hay productos con stock bajo.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Plataforma</th>
                  <th>Existencias</th>
                  <th>Stock mínimo</th>
                </tr>
              </thead>

              <tbody>
                {datos.productosStockBajo.map((producto) => (
                  <tr key={producto.id_producto}>
                    <td>{producto.titulo}</td>
                    <td>{producto.plataforma}</td>
                    <td>
                      <span className="stock-warning">{producto.stock}</span>
                    </td>
                    <td>{producto.stock_minimo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
