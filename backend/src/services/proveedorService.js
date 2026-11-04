const { Proveedor } = require("../models");

const listar = () =>
  Proveedor.findAll({
    order: [["id_proveedor", "ASC"]],
  });

const obtener = (id) => Proveedor.findByPk(id);

const crear = (datos) => Proveedor.create(datos);

const actualizar = async (id, datos) => {
  const proveedor = await Proveedor.findByPk(id);

  if (!proveedor) return null;

  await proveedor.update(datos);
  return proveedor;
};

const eliminar = async (id) => {
  const proveedor = await Proveedor.findByPk(id);

  if (!proveedor) return null;

  await proveedor.destroy();
  return true;
};

module.exports = { listar, obtener, crear, actualizar, eliminar };
