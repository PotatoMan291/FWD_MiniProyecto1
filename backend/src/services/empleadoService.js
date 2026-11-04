const { Empleado } = require("../models");

const listar = () =>
  Empleado.findAll({
    order: [["id_empleado", "ASC"]],
  });

const obtener = (id) => Empleado.findByPk(id);

const crear = (datos) => Empleado.create(datos);

const actualizar = async (id, datos) => {
  const empleado = await Empleado.findByPk(id);

  if (!empleado) return null;

  await empleado.update(datos);
  return empleado;
};

const eliminar = async (id) => {
  const empleado = await Empleado.findByPk(id);

  if (!empleado) return null;

  await empleado.destroy();
  return true;
};

module.exports = { listar, obtener, crear, actualizar, eliminar };
