const { Categoria } = require("../models");

const listar = () =>
  Categoria.findAll({
    order: [["id_categoria", "ASC"]],
  });

const obtener = (id) => Categoria.findByPk(id);

const crear = (datos) => Categoria.create(datos);

const actualizar = async (id, datos) => {
  const categoria = await Categoria.findByPk(id);

  if (!categoria) return null;

  await categoria.update(datos);
  return categoria;
};

const eliminar = async (id) => {
  const categoria = await Categoria.findByPk(id);

  if (!categoria) return null;

  await categoria.destroy();
  return true;
};

module.exports = { listar, obtener, crear, actualizar, eliminar };
