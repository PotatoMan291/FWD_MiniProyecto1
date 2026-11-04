const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Empleado = sequelize.define(
  "Empleado",
  {
    id_empleado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    puesto: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    correo: {
      type: DataTypes.STRING(150),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    tableName: "empleados",
    timestamps: true,
    underscored: true,
  },
);

module.exports = Empleado;
