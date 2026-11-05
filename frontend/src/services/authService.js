import api from "./api";

const registrar = async (datos) => {
  const respuesta = await api.post("/auth/register", datos);
  return respuesta.data;
};

const iniciarSesion = async (datos) => {
  const respuesta = await api.post("/auth/login", datos);
  return respuesta.data;
};

const obtenerPerfil = async () => {
  const respuesta = await api.get("/auth/me");
  return respuesta.data;
};

const authService = {
  registrar,
  iniciarSesion,
  obtenerPerfil,
};

export default authService;