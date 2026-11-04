"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("empleados", [
      {
        nombre: "Daniel",
        apellido: "Mora",
        puesto: "Administrador de inventario",
        correo: "daniel.mora@gamevault.example",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Sofía",
        apellido: "Vargas",
        puesto: "Asistente de ventas",
        correo: "sofia.vargas@gamevault.example",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Andrés",
        apellido: "Rojas",
        puesto: "Encargado de bodega",
        correo: "andres.rojas@gamevault.example",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("empleados", null, {});
  },
};
