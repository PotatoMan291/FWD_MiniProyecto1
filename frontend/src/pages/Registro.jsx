import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

export default function Registro() {
  const { registrar, autenticado } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  if (autenticado) {
    return <Navigate to="/" replace />;
  }

  const manejarSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);

    try {
      await registrar(nombre, correo, password);
      navigate("/login", {
        replace: true,
        state: {
          mensaje: "Cuenta creada correctamente. Ahora puedes iniciar sesión.",
        },
      });
    } catch (error) {
      setError(error.response?.data?.error || "No se pudo crear la cuenta.");
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

        <h2>Crear cuenta</h2>
        <p className="auth-description">Regístrate para acceder al sistema.</p>

        <form onSubmit={manejarSubmit}>
          <label htmlFor="nombre">Nombre completo</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            placeholder="Tu nombre"
            autoComplete="name"
            required
          />

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
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            minLength={8}
            required
          />

          <label htmlFor="confirmarPassword">Confirmar contraseña</label>
          <input
            id="confirmarPassword"
            type="password"
            value={confirmarPassword}
            onChange={(event) => setConfirmarPassword(event.target.value)}
            placeholder="Repite la contraseña"
            autoComplete="new-password"
            minLength={8}
            required
          />

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="auth-button" disabled={cargando}>
            {cargando ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </section>
    </main>
  );
}
