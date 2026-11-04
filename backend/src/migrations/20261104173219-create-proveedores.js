"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("proveedores", {
      id_proveedor: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nombre: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      telefono: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      correo: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      direccion: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    await queryInterface.dropTable("proveedores");
  },
};
