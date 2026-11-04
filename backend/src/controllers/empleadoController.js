const service = require("../services/empleadoService");
const { crearControlador } = require("./crudController");

module.exports = crearControlador(service, "Empleado");