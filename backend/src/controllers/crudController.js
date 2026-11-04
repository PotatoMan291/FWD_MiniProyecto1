const manejarError = (res, error) => {
  console.error(error);

  if (
    error.name === "SequelizeForeignKeyConstraintError" ||
    error.name === "SequelizeUniqueConstraintError" ||
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeDatabaseError"
  ) {
    return res.status(400).json({
      mensaje: error.message,
    });
  }

  return res.status(500).json({
    mensaje: "Ocurrió un error en el servidor.",
  });
};

const crearControlador = (service, nombre) => ({
  listar: async (req, res) => {
    try {
      res.json(await service.listar());
    } catch (error) {
      manejarError(res, error);
    }
  },

  obtener: async (req, res) => {
    try {
      const registro = await service.obtener(req.params.id);

      if (!registro) {
        return res.status(404).json({
          mensaje: `${nombre} no encontrado.`,
        });
      }

      res.json(registro);
    } catch (error) {
      manejarError(res, error);
    }
  },

  crear: async (req, res) => {
    try {
      const registro = await service.crear(req.body);

      res.status(201).json(registro);
    } catch (error) {
      manejarError(res, error);
    }
  },

  actualizar: async (req, res) => {
    try {
      const registro = await service.actualizar(req.params.id, req.body);

      if (!registro) {
        return res.status(404).json({
          mensaje: `${nombre} no encontrado.`,
        });
      }

      res.json(registro);
    } catch (error) {
      manejarError(res, error);
    }
  },

  eliminar: async (req, res) => {
    try {
      const resultado = await service.eliminar(req.params.id);

      if (!resultado) {
        return res.status(404).json({
          mensaje: `${nombre} no encontrado.`,
        });
      }

      res.json({
        mensaje: `${nombre} eliminado correctamente.`,
      });
    } catch (error) {
      manejarError(res, error);
    }
  },
});

module.exports = { crearControlador, manejarError };
