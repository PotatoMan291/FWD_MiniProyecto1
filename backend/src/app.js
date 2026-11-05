require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { sequelize } = require("./models");

const categoriaRoutes = require("./routes/categoriaRoutes");
const proveedorRoutes = require("./routes/proveedorRoutes");
const empleadoRoutes = require("./routes/empleadoRoutes");
const productoRoutes = require("./routes/productoRoutes");
const movimientoRoutes = require("./routes/movimientoRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "GameVault API",
    estado: "Funcionando",
  });
});

app.get("/api/health", async (req, res) => {
  try {
    await sequelize.authenticate();

    res.json({
      estado: "OK",
      baseDatos: "Conectada",
    });
  } catch (error) {
    res.status(500).json({
      estado: "ERROR",
      mensaje: "No se pudo conectar con PostgreSQL.",
    });
  }
});

app.use("/api/categorias", categoriaRoutes);
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/empleados", empleadoRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/movimientos", movimientoRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({
    mensaje: "Ruta no encontrada.",
  });
});

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();

    console.log("Conexión con PostgreSQL establecida.");

    app.listen(PORT, () => {
      console.log(`GameVault API ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

iniciarServidor();

module.exports = app;
