"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("categorias", [
      {
        nombre: "Terror",
        descripcion: "Videojuegos de terror y supervivencia",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: "Acción",
        descripcion: "Videojuegos de acción y combate",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: "Aventura",
        descripcion: "Videojuegos de exploración y aventura",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: "RPG",
        descripcion: "Videojuegos de rol",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: "Deportes",
        descripcion: "Videojuegos deportivos",
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("categorias", null, {});
  }
};