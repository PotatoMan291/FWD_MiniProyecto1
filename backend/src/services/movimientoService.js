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

const validarCantidad = (cantidad) => {
  const valor = Number(cantidad);

  if (!Number.isInteger(valor) || valor <= 0) {
    throw new Error("La cantidad debe ser un número entero mayor que cero.");
  }

  return valor;
};

const aplicarMovimiento = (producto, tipo, cantidad) => {
  if (tipo === "ENTRADA") {
    producto.stock += cantidad;
  } else if (tipo === "SALIDA") {
    if (producto.stock < cantidad) {
      throw new Error("No hay suficiente stock para registrar esta salida.");
    }

    producto.stock -= cantidad;
  } else if (tipo === "AJUSTE") {
    // En un AJUSTE, cantidad representa el stock final deseado.
    producto.stock = cantidad;
  } else {
    throw new Error("El tipo debe ser ENTRADA, SALIDA o AJUSTE.");
  }
};

const revertirMovimiento = (producto, tipo, cantidad) => {
  if (tipo === "ENTRADA") {
    producto.stock -= cantidad;
  } else if (tipo === "SALIDA") {
    producto.stock += cantidad;
  } else if (tipo === "AJUSTE") {
    // No se conoce el stock anterior a este ajuste.
    throw new Error(
      "No se puede modificar un movimiento AJUSTE porque no se conoce el stock anterior.",
    );
  }

  if (producto.stock < 0) {
    throw new Error(
      "No se puede modificar el movimiento porque dejaría el stock negativo.",
    );
  }
};

const crear = async (datos) => {
  return sequelize.transaction(async (transaction) => {
    const cantidad = validarCantidad(datos.cantidad);

    const producto = await Producto.findByPk(datos.id_producto, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!producto) {
      throw new Error("El producto indicado no existe.");
    }

    const empleado = await Empleado.findByPk(datos.id_empleado, {
      transaction,
    });

    if (!empleado) {
      throw new Error("El empleado indicado no existe.");
    }

    aplicarMovimiento(producto, datos.tipo, cantidad);

    await producto.save({ transaction });

    const movimiento = await MovimientoInventario.create(
      {
        ...datos,
        cantidad,
      },
      { transaction },
    );

    return MovimientoInventario.findByPk(movimiento.id_movimiento, {
      include: relaciones,
      transaction,
    });
  });
};

const actualizar = async (id, datos) => {
  return sequelize.transaction(async (transaction) => {
    const movimiento = await MovimientoInventario.findByPk(id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!movimiento) {
      return null;
    }

    // No se puede revertir un AJUSTE sin guardar el stock previo.
    if (movimiento.tipo === "AJUSTE") {
      throw new Error(
        "No se puede modificar un movimiento AJUSTE porque no se conoce el stock anterior.",
      );
    }

    const cantidadNueva = validarCantidad(
      datos.cantidad ?? movimiento.cantidad,
    );

    const tipoNuevo = datos.tipo ?? movimiento.tipo;
    const idProductoNuevo = datos.id_producto ?? movimiento.id_producto;
    const idEmpleadoNuevo = datos.id_empleado ?? movimiento.id_empleado;

    const productoAnterior = await Producto.findByPk(movimiento.id_producto, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!productoAnterior) {
      throw new Error("El producto asociado al movimiento no existe.");
    }

    let productoNuevo = productoAnterior;

    if (Number(idProductoNuevo) !== Number(movimiento.id_producto)) {
      productoNuevo = await Producto.findByPk(idProductoNuevo, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!productoNuevo) {
        throw new Error("El producto indicado no existe.");
      }
    }

    const empleado = await Empleado.findByPk(idEmpleadoNuevo, {
      transaction,
    });

    if (!empleado) {
      throw new Error("El empleado indicado no existe.");
    }

    // Primero revertimos el efecto del movimiento anterior.
    revertirMovimiento(productoAnterior, movimiento.tipo, movimiento.cantidad);

    // Luego aplicamos el movimiento actualizado.
    aplicarMovimiento(productoNuevo, tipoNuevo, cantidadNueva);

    await productoAnterior.save({ transaction });

    if (productoNuevo.id_producto !== productoAnterior.id_producto) {
      await productoNuevo.save({ transaction });
    }

    await movimiento.update(
      {
        tipo: tipoNuevo,
        cantidad: cantidadNueva,
        fecha: datos.fecha ?? movimiento.fecha,
        observacion: datos.observacion ?? movimiento.observacion,
        id_producto: idProductoNuevo,
        id_empleado: idEmpleadoNuevo,
      },
      { transaction },
    );

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

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar,
};
