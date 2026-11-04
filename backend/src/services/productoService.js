const { Producto, Categoria, Proveedor } = require("../models");

const relaciones = [
  {
    model: Categoria,
    attributes: ["id_categoria", "nombre"],
  },
  {
    model: Proveedor,
    attributes: ["id_proveedor", "nombre"],
  },
];

const listar = () =>
  Producto.findAll({
    include: relaciones,
    order: [["id_producto", "ASC"]],
  });

const obtener = (id) =>
  Producto.findByPk(id, {
    include: relaciones,
  });

const crear = async (datos) => {
  const producto = await Producto.create(datos);
  return obtener(producto.id_producto);
};

const actualizar = async (id, datos) => {
  const producto = await Producto.findByPk(id);

  if (!producto) return null;

  await producto.update(datos);
  return obtener(id);
};

const eliminar = async (id) => {
  const producto = await Producto.findByPk(id);

  if (!producto) return null;

  await producto.destroy();
  return true;
};

module.exports = { listar, obtener, crear, actualizar, eliminar };
