import { useEffect, useState } from "react";
import api from "../services/api";

const configuraciones = {
  productos: {
    titulo: "Productos",
    ruta: "/productos",
    campos: [
      { nombre: "titulo", etiqueta: "Título", requerido: true },
      { nombre: "descripcion", etiqueta: "Descripción", tipo: "textarea" },
      { nombre: "plataforma", etiqueta: "Plataforma", requerido: true },
      { nombre: "edicion", etiqueta: "Edición" },
      {
        nombre: "precio",
        etiqueta: "Precio",
        tipo: "number",
        requerido: true,
      },
      { nombre: "stock", etiqueta: "Existencias", tipo: "number" },
      { nombre: "stock_minimo", etiqueta: "Stock mínimo", tipo: "number" },
      {
        nombre: "id_categoria",
        etiqueta: "Categoría",
        tipo: "relacion",
        ruta: "/categorias",
        id: "id_categoria",
        texto: "nombre",
        requerido: true,
      },
      {
        nombre: "id_proveedor",
        etiqueta: "Proveedor",
        tipo: "relacion",
        ruta: "/proveedores",
        id: "id_proveedor",
        texto: "nombre",
        requerido: true,
      },
    ],
    columnas: [
      ["titulo", "Videojuego"],
      ["plataforma", "Plataforma"],
      ["Categoria.nombre", "Categoría"],
      ["Proveedor.nombre", "Proveedor"],
      ["precio", "Precio"],
      ["stock", "Stock"],
    ],
  },

  categorias: {
    titulo: "Categorías",
    ruta: "/categorias",
    campos: [
      { nombre: "nombre", etiqueta: "Nombre", requerido: true },
      { nombre: "descripcion", etiqueta: "Descripción", tipo: "textarea" },
    ],
    columnas: [
      ["nombre", "Nombre"],
      ["descripcion", "Descripción"],
    ],
  },

  proveedores: {
    titulo: "Proveedores",
    ruta: "/proveedores",
    campos: [
      { nombre: "nombre", etiqueta: "Nombre", requerido: true },
      { nombre: "telefono", etiqueta: "Teléfono" },
      { nombre: "correo", etiqueta: "Correo", tipo: "email" },
      { nombre: "direccion", etiqueta: "Dirección", tipo: "textarea" },
    ],
    columnas: [
      ["nombre", "Proveedor"],
      ["telefono", "Teléfono"],
      ["correo", "Correo"],
    ],
  },

  empleados: {
    titulo: "Empleados",
    ruta: "/empleados",
    campos: [
      { nombre: "nombre", etiqueta: "Nombre", requerido: true },
      { nombre: "apellido", etiqueta: "Apellido", requerido: true },
      { nombre: "puesto", etiqueta: "Puesto" },
      { nombre: "correo", etiqueta: "Correo", tipo: "email" },
    ],
    columnas: [
      ["nombre", "Nombre"],
      ["apellido", "Apellido"],
      ["puesto", "Puesto"],
      ["correo", "Correo"],
    ],
  },

  movimientos: {
    titulo: "Movimientos de inventario",
    ruta: "/movimientos",
    campos: [
      {
        nombre: "tipo",
        etiqueta: "Tipo de movimiento",
        tipo: "select",
        opciones: ["ENTRADA", "SALIDA", "AJUSTE"],
        requerido: true,
      },
      {
        nombre: "cantidad",
        etiqueta: "Cantidad",
        tipo: "number",
        requerido: true,
      },
      {
        nombre: "id_producto",
        etiqueta: "Producto",
        tipo: "relacion",
        ruta: "/productos",
        id: "id_producto",
        texto: "titulo",
        requerido: true,
      },
      {
        nombre: "id_empleado",
        etiqueta: "Empleado responsable",
        tipo: "relacion",
        ruta: "/empleados",
        id: "id_empleado",
        texto: "nombre",
        textoSecundario: "apellido",
        requerido: true,
      },
      {
        nombre: "observacion",
        etiqueta: "Observación",
        tipo: "textarea",
      },
    ],
    columnas: [
      ["tipo", "Tipo"],
      ["Producto.titulo", "Producto"],
      ["Empleado.nombreCompleto", "Empleado"],
      ["cantidad", "Cantidad"],
      ["fecha", "Fecha"],
      ["observacion", "Observación"],
    ],
  },
};

const obtenerValor = (registro, ruta) => {
  return ruta.split(".").reduce((valor, parte) => {
    if (valor == null) return undefined;

    if (parte === "nombreCompleto") {
      return `${valor.nombre ?? ""} ${valor.apellido ?? ""}`.trim();
    }

    return valor[parte];
  }, registro);
};

const obtenerId = (registro) =>
  registro.id_producto ??
  registro.id_categoria ??
  registro.id_proveedor ??
  registro.id_empleado ??
  registro.id_movimiento;

export default function ManagementPage({ seccion }) {
  const config = configuraciones[seccion];

  const [registros, setRegistros] = useState([]);
  const [opcionesRelacion, setOpcionesRelacion] = useState({});
  const [formulario, setFormulario] = useState({});
  const [registroEditando, setRegistroEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  const cargarRegistros = async () => {
    try {
      setCargando(true);

      const respuesta = await api.get(config.ruta);
      setRegistros(respuesta.data);
      setError("");
    } catch {
      setError("No se pudieron cargar los registros.");
    } finally {
      setCargando(false);
    }
  };

  const cargarRelaciones = async () => {
    const camposRelacion = config.campos.filter(
      (campo) => campo.tipo === "relacion",
    );

    if (camposRelacion.length === 0) {
      setOpcionesRelacion({});
      return;
    }

    try {
      const respuestas = await Promise.all(
        camposRelacion.map((campo) => api.get(campo.ruta)),
      );

      const opciones = {};

      camposRelacion.forEach((campo, indice) => {
        opciones[campo.nombre] = respuestas[indice].data;
      });

      setOpcionesRelacion(opciones);
    } catch {
      setError("No se pudieron cargar las opciones de las relaciones.");
    }
  };

  useEffect(() => {
    setFormulario({});
    setRegistroEditando(null);
    setMensaje("");
    setError("");
    setBusqueda("");

    cargarRegistros();
    cargarRelaciones();
  }, [seccion]);

  const cambiarCampo = (nombre, valor) => {
    setFormulario((actual) => ({
      ...actual,
      [nombre]: valor,
    }));
  };

  const limpiarFormulario = () => {
    setFormulario({});
    setRegistroEditando(null);
  };

  const guardar = async (evento) => {
    evento.preventDefault();

    try {
      const datos = { ...formulario };

      config.campos.forEach((campo) => {
        if (
          campo.tipo === "number" &&
          datos[campo.nombre] !== undefined &&
          datos[campo.nombre] !== ""
        ) {
          datos[campo.nombre] = Number(datos[campo.nombre]);
        }

        if (
          campo.tipo === "relacion" &&
          datos[campo.nombre] !== undefined &&
          datos[campo.nombre] !== ""
        ) {
          datos[campo.nombre] = Number(datos[campo.nombre]);
        }
      });

      if (registroEditando !== null) {
        await api.put(`${config.ruta}/${registroEditando}`, datos);
        setMensaje("Registro actualizado correctamente.");
      } else {
        await api.post(config.ruta, datos);
        setMensaje("Registro creado correctamente.");
      }

      limpiarFormulario();
      await cargarRegistros();
      setError("");
    } catch (error) {
      setError(
        error.response?.data?.mensaje || "No se pudo guardar el registro.",
      );
      setMensaje("");
    }
  };

  const editar = (registro) => {
    const id = obtenerId(registro);

    setRegistroEditando(id);

    const valores = {};

    config.campos.forEach((campo) => {
      valores[campo.nombre] = registro[campo.nombre] ?? "";
    });

    setFormulario(valores);
    setMensaje("");
    setError("");
  };

  const eliminar = async (registro) => {
    const id = obtenerId(registro);

    if (!window.confirm("¿Deseas eliminar este registro?")) {
      return;
    }

    try {
      await api.delete(`${config.ruta}/${id}`);

      setMensaje("Registro eliminado correctamente.");
      setError("");

      await cargarRegistros();
    } catch (error) {
      setError(
        error.response?.data?.mensaje || "No se pudo eliminar el registro.",
      );
    }
  };

  const registrosFiltrados = registros.filter((registro) =>
    config.columnas.some(([campo]) =>
      String(obtenerValor(registro, campo) ?? "")
        .toLowerCase()
        .includes(busqueda.toLowerCase()),
    ),
  );

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">GESTIÓN DEL SISTEMA</p>
          <h1>{config.titulo}</h1>
          <p className="page-description">
            Administra la información registrada en GameVault.
          </p>
        </div>
      </div>

      {mensaje && <div className="success-message">{mensaje}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="management-layout">
        <section className="panel form-panel">
          <div className="panel-heading">
            <div>
              <h2>
                {registroEditando !== null
                  ? "Editar registro"
                  : "Nuevo registro"}
              </h2>
              <p>Completa la información del formulario.</p>
            </div>
          </div>

          <form onSubmit={guardar}>
            {config.campos.map((campo) => (
              <div className="form-group" key={campo.nombre}>
                <label htmlFor={campo.nombre}>{campo.etiqueta}</label>

                {campo.tipo === "textarea" ? (
                  <textarea
                    id={campo.nombre}
                    value={formulario[campo.nombre] ?? ""}
                    onChange={(e) => cambiarCampo(campo.nombre, e.target.value)}
                    required={campo.requerido}
                  />
                ) : campo.tipo === "select" ? (
                  <select
                    id={campo.nombre}
                    value={formulario[campo.nombre] ?? ""}
                    onChange={(e) => cambiarCampo(campo.nombre, e.target.value)}
                    required={campo.requerido}
                  >
                    <option value="">Selecciona una opción</option>

                    {campo.opciones.map((opcion) => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                ) : campo.tipo === "relacion" ? (
                  <select
                    id={campo.nombre}
                    value={formulario[campo.nombre] ?? ""}
                    onChange={(e) => cambiarCampo(campo.nombre, e.target.value)}
                    required={campo.requerido}
                  >
                    <option value="">Selecciona una opción</option>

                    {(opcionesRelacion[campo.nombre] ?? []).map((opcion) => {
                      const texto = campo.textoSecundario
                        ? `${opcion[campo.texto]} ${opcion[campo.textoSecundario]}`
                        : opcion[campo.texto];

                      return (
                        <option key={opcion[campo.id]} value={opcion[campo.id]}>
                          {texto}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <input
                    id={campo.nombre}
                    type={campo.tipo || "text"}
                    value={formulario[campo.nombre] ?? ""}
                    onChange={(e) => cambiarCampo(campo.nombre, e.target.value)}
                    required={campo.requerido}
                    min={campo.tipo === "number" ? 0 : undefined}
                    step={campo.nombre === "precio" ? "0.01" : "1"}
                  />
                )}
              </div>
            ))}

            <div className="form-actions">
              <button className="button-primary" type="submit">
                {registroEditando !== null
                  ? "Guardar cambios"
                  : "Crear registro"}
              </button>

              <button
                className="button-secondary"
                type="button"
                onClick={limpiarFormulario}
              >
                Limpiar
              </button>
            </div>
          </form>
        </section>

        <section className="panel table-panel">
          <div className="panel-heading">
            <div>
              <h2>Registros</h2>
              <p>{registros.length} registros en total</p>
            </div>
          </div>

          <input
            className="search-input"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          {cargando ? (
            <p>Cargando registros...</p>
          ) : registrosFiltrados.length === 0 ? (
            <p className="empty-state">No hay registros para mostrar.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    {config.columnas.map(([campo, etiqueta]) => (
                      <th key={campo}>{etiqueta}</th>
                    ))}
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {registrosFiltrados.map((registro) => {
                    const id = obtenerId(registro);

                    return (
                      <tr key={id}>
                        {config.columnas.map(([campo]) => {
                          const valor = obtenerValor(registro, campo);

                          return (
                            <td key={campo}>
                              {campo === "precio"
                                ? `₡${Number(valor).toLocaleString("es-CR")}`
                                : (valor ?? "—")}
                            </td>
                          );
                        })}

                        <td>
                          <div className="table-actions">
                            {!config.soloCrear && (
                              <button
                                className="button-small"
                                onClick={() => editar(registro)}
                              >
                                Editar
                              </button>
                            )}

                            <button
                              className="button-small button-danger"
                              onClick={() => eliminar(registro)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
