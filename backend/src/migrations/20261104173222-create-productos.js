"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("productos", {
      id_producto: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      titulo: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      plataforma: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      edicion: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      precio: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      stock_minimo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5,
      },
      id_categoria: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "categorias",
          key: "id_categoria",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      id_proveedor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "proveedores",
          key: "id_proveedor",
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
    await queryInterface.dropTable("productos");
  },
};
