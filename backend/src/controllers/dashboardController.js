const {
  Producto,
  Categoria,
  Proveedor,
  Empleado,
  MovimientoInventario,
} = require("../models");

const { Op } = require("sequelize");

const obtenerDashboard = async (req, res) => {
  try {
    const [
      totalProductos,
      totalCategorias,
      totalProveedores,
      totalEmpleados,
      totalMovimientos,
      productosStockBajo,
    ] = await Promise.all([
      Producto.count(),
      Categoria.count(),
      Proveedor.count(),
      Empleado.count(),
      MovimientoInventario.count(),

      Producto.findAll({
        where: {
          stock: {
            [Op.lte]: Producto.sequelize.col("stock_minimo"),
          },
        },
        order: [["stock", "ASC"]],
        limit: 10,
      }),
    ]);

    res.json({
      totalProductos,
      totalCategorias,
      totalProveedores,
      totalEmpleados,
      totalMovimientos,
      productosStockBajo,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "No se pudo obtener el dashboard.",
    });
  }
};

module.exports = { obtenerDashboard };
