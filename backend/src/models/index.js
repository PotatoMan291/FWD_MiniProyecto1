const sequelize = require("../config/database");

const Categoria = require("./Categoria");
const Proveedor = require("./Proveedor");
const Producto = require("./Producto");
const Empleado = require("./Empleado");
const MovimientoInventario = require("./MovimientoInventario");
const Usuario = require("./Usuario");

// Una categoría tiene muchos productos
Categoria.hasMany(Producto, {
  foreignKey: "id_categoria",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

Producto.belongsTo(Categoria, {
  foreignKey: "id_categoria",
});

// Un proveedor suministra muchos productos
Proveedor.hasMany(Producto, {
  foreignKey: "id_proveedor",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

Producto.belongsTo(Proveedor, {
  foreignKey: "id_proveedor",
});

// Un producto tiene muchos movimientos
Producto.hasMany(MovimientoInventario, {
  foreignKey: "id_producto",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

MovimientoInventario.belongsTo(Producto, {
  foreignKey: "id_producto",
});

// Un empleado registra muchos movimientos
Empleado.hasMany(MovimientoInventario, {
  foreignKey: "id_empleado",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

MovimientoInventario.belongsTo(Empleado, {
  foreignKey: "id_empleado",
});

module.exports = {
  sequelize,
  Categoria,
  Proveedor,
  Producto,
  Empleado,
  MovimientoInventario,
  Usuario,
};
