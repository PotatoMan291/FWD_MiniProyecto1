const {
  sequelize,
  MovimientoInventario,
  Producto,
  Empleado,
} = require("../models");

const relaciones = [
  {
    model: Producto,
    attributes: ["id_producto", "titulo", "stock"],
  },
  {
    model: Empleado,
    attributes: ["id_empleado", "nombre", "apellido"],
  },
];

const listar = () =>
  MovimientoInventario.findAll({
    include: relaciones,
    order: [["id_movimiento", "DESC"]],
  });

const obtener = (id) =>
  MovimientoInventario.findByPk(id, {
    include: relaciones,
  });

const crear = async (datos) => {
  return sequelize.transaction(async (transaction) => {
    const producto = await Producto.findByPk(datos.id_producto, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!producto) {
      throw new Error("El producto indicado no existe.");
    }

    const cantidad = Number(datos.cantidad);

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new Error("La cantidad debe ser un número entero mayor que cero.");
    }

    if (datos.tipo === "SALIDA" && producto.stock < cantidad) {
      throw new Error("No hay suficiente stock para registrar esta salida.");
    }

    if (datos.tipo === "ENTRADA") {
      producto.stock += cantidad;
    } else if (datos.tipo === "SALIDA") {
      producto.stock -= cantidad;
    } else if (datos.tipo === "AJUSTE") {
      // Para AJUSTE, cantidad representa el stock final deseado.
      producto.stock = cantidad;
    } else {
      throw new Error("El tipo debe ser ENTRADA, SALIDA o AJUSTE.");
    }

    await producto.save({ transaction });

    const movimiento = await MovimientoInventario.create(datos, {
      transaction,
    });

    return MovimientoInventario.findByPk(movimiento.id_movimiento, {
      include: relaciones,
      transaction,
    });
  });
};

const eliminar = async (id) => {
  return sequelize.transaction(async (transaction) => {
    const movimiento = await MovimientoInventario.findByPk(id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!movimiento) return null;

    const producto = await Producto.findByPk(movimiento.id_producto, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (producto) {
      if (movimiento.tipo === "ENTRADA") {
        producto.stock -= movimiento.cantidad;
      } else if (movimiento.tipo === "SALIDA") {
        producto.stock += movimiento.cantidad;
      } else if (movimiento.tipo === "AJUSTE") {
        throw new Error(
          "No se puede eliminar un ajuste sin conocer el stock anterior.",
        );
      }

      if (producto.stock < 0) {
        throw new Error(
          "No se puede eliminar el movimiento porque dejaría el stock negativo.",
        );
      }

      await producto.save({ transaction });
    }

    await movimiento.destroy({ transaction });

    return true;
  });
};

module.exports = { listar, obtener, crear, eliminar };
