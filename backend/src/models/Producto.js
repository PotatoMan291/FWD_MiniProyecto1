const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Producto = sequelize.define(
  "Producto",
  {
    id_producto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    plataforma: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    edicion: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    stock_minimo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
      validate: {
        min: 0,
      },
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_proveedor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "productos",
    timestamps: true,
    underscored: true,
  },
);

module.exports = Producto;
