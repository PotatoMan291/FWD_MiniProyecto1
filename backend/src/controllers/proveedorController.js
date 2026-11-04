const service = require("../services/proveedorService");
const { crearControlador } = require("./crudController");

module.exports = crearControlador(service, "Proveedor");
