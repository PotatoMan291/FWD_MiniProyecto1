const service = require("../services/movimientoService");
const { manejarError } = require("./crudController");

module.exports = {
  listar: async (req, res) => {
    try {
      res.json(await service.listar());
    } catch (error) {
      manejarError(res, error);
    }
  },

  obtener: async (req, res) => {
    try {
      const movimiento = await service.obtener(req.params.id);

      if (!movimiento) {
        return res.status(404).json({
          mensaje: "Movimiento no encontrado.",
        });
      }

      res.json(movimiento);
    } catch (error) {
      manejarError(res, error);
    }
  },

  crear: async (req, res) => {
    try {
      const movimiento = await service.crear(req.body);

      res.status(201).json(movimiento);
    } catch (error) {
      if (error.message) {
        return res.status(400).json({
          mensaje: error.message,
        });
      }

      manejarError(res, error);
    }
  },

  eliminar: async (req, res) => {
    try {
      const resultado = await service.eliminar(req.params.id);

      if (!resultado) {
        return res.status(404).json({
          mensaje: "Movimiento no encontrado.",
        });
      }

      res.json({
        mensaje: "Movimiento eliminado correctamente.",
      });
    } catch (error) {
      if (error.message) {
        return res.status(400).json({
          mensaje: error.message,
        });
      }

      manejarError(res, error);
    }
  },
};
