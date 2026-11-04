const service = require("../services/categoriaService");
const { crearControlador } = require("./crudController");

module.exports = crearControlador(service, "Categoría");
