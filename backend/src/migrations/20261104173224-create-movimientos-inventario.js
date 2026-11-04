"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("movimientos_inventario", {
      id_movimiento: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tipo: {
        type: Sequelize.ENUM("ENTRADA", "SALIDA", "AJUSTE"),
        allowNull: false,
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fecha: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      observacion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      id_producto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "productos",
          key: "id_producto",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      id_empleado: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "empleados",
          key: "id_empleado",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("movimientos_inventario");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_movimientos_inventario_tipo";',
    );
  },
};
