
const express = require("express");
const router = express.Router();

const {
  obtenerDashboard,
} = require("../controllers/dashboardController");

const verificarToken = require("../middlewares/authMiddleware");

router.use(verificarToken);

router.get("/", obtenerDashboard);

module.exports = router;
