const service = require("../services/productoService");
const { crearControlador } = require("./crudController");

module.exports = crearControlador(service, "Producto");