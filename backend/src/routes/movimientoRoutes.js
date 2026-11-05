
const express = require("express");
const router = express.Router();

const controller = require("../controllers/movimientoController");
const verificarToken = require("../middlewares/authMiddleware");

router.use(verificarToken);

router.get("/", controller.listar);
router.get("/:id", controller.obtener);
router.post("/", controller.crear);
router.delete("/:id", controller.eliminar);

module.exports = router;
