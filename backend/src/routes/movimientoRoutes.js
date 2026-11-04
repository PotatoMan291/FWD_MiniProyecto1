const express = require("express");
const router = express.Router();
const controller = require("../controllers/movimientoController");

router.get("/", controller.listar);
router.get("/:id", controller.obtener);
router.post("/", controller.crear);
router.delete("/:id", controller.eliminar);

module.exports = router;