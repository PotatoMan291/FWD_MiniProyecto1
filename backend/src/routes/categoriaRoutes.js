const express = require("express");
const router = express.Router();

const controller = require("../controllers/categoriaController");
const verificarToken = require("../middlewares/authMiddleware");

// Todas las rutas de categorías requieren autenticación.
router.use(verificarToken);

router.get("/", controller.listar);
router.get("/:id", controller.obtener);
router.post("/", controller.crear);
router.put("/:id", controller.actualizar);
router.delete("/:id", controller.eliminar);

module.exports = router;
