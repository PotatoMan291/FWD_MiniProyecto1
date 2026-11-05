import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

export default function Login() {
  const { iniciarSesion, autenticado } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  if (autenticado) {
    return <Navigate to="/" replace />;
  }

  const manejarSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setCargando(true);

    try {
      await iniciarSesion(correo, password);
      navigate("/", { replace: true });
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "No se pudo iniciar sesión. Verifica tus credenciales.",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">G</div>
          <h1>GameVault</h1>
          <p>Sistema de inventario de videojuegos</p>
        </div>

        <h2>Iniciar sesión</h2>
        <p className="auth-description">
          Ingresa tus credenciales para acceder al sistema.
        </p>

        <form onSubmit={manejarSubmit}>
          <label htmlFor="correo">Correo electrónico</label>
          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(event) => setCorreo(event.target.value)}
            placeholder="usuario@gamevault.com"
            autoComplete="email"
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
            required
          />

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="auth-button" disabled={cargando}>
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="auth-footer">
          ¿No tienes una cuenta? <Link to="/registro">Crear cuenta</Link>
        </p>
      </section>
    </main>
  );
}
