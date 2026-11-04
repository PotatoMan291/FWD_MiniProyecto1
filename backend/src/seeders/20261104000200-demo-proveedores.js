"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("proveedores", [
      {
        nombre: "Distribuidora GameVault",
        telefono: "2222-3333",
        correo: "ventas@gamevault.example",
        direccion: "San José, Costa Rica",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Gaming Supply CR",
        telefono: "2444-5555",
        correo: "contacto@gamingsupply.example",
        direccion: "Heredia, Costa Rica",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Pixel Distribution",
        telefono: "2555-6666",
        correo: "info@pixeldistribution.example",
        direccion: "Cartago, Costa Rica",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("proveedores", null, {});
  },
};
