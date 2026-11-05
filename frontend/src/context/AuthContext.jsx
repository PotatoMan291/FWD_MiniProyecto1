import { createContext, useContext, useState } from "react";

import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem("usuario");

    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  const iniciarSesion = async (correo, password) => {
    const respuesta = await authService.iniciarSesion({
      correo,
      password,
    });

    localStorage.setItem("token", respuesta.token);
    localStorage.setItem("usuario", JSON.stringify(respuesta.usuario));

    setToken(respuesta.token);
    setUsuario(respuesta.usuario);

    return respuesta;
  };

  const registrar = async (nombre, correo, password) => {
    return await authService.registrar({
      nombre,
      correo,
      password,
    });
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    setToken(null);
    setUsuario(null);
  };

  const valor = {
    token,
    usuario,
    autenticado: Boolean(token),
    iniciarSesion,
    registrar,
    cerrarSesion,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  }

  return contexto;
}
