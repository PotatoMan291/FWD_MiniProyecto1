
const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const verificarToken = require("../middlewares/authMiddleware");

router.post("/register", authController.registrar);
router.post("/login", authController.iniciarSesion);
router.get("/me", verificarToken, authController.obtenerPerfil);

module.exports = router;
