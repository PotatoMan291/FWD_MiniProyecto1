const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const MovimientoInventario = sequelize.define(
  "MovimientoInventario",
  {
    id_movimiento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipo: {
      type: DataTypes.ENUM("ENTRADA", "SALIDA", "AJUSTE"),
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    observacion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "movimientos_inventario",
    timestamps: true,
    underscored: true,
  },
);

module.exports = MovimientoInventario;
