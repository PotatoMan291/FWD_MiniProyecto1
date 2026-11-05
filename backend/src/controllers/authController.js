const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");

const registrar = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({
        error: "Nombre, correo y contraseña son obligatorios.",
      });
    }

    const nombreNormalizado = nombre.trim();
    const correoNormalizado = correo.trim().toLowerCase();

    if (!nombreNormalizado) {
      return res.status(400).json({
        error: "El nombre es obligatorio.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "La contraseña debe tener al menos 8 caracteres.",
      });
    }

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoNormalizado);

    if (!correoValido) {
      return res.status(400).json({
        error: "Debe ingresar un correo electrónico válido.",
      });
    }

    const usuarioExistente = await Usuario.findOne({
      where: {
        correo: correoNormalizado,
      },
    });

    if (usuarioExistente) {
      return res.status(400).json({
        error: "El correo electrónico ya está registrado.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre: nombreNormalizado,
      correo: correoNormalizado,
      password: passwordHash,
    });

    const usuarioRespuesta = {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      correo: usuario.correo,
      created_at: usuario.created_at,
    };

    return res.status(201).json({
      mensaje: "Usuario registrado correctamente.",
      usuario: usuarioRespuesta,
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error: "El correo electrónico ya está registrado.",
      });
    }

    return res.status(500).json({
      error: "Error interno al registrar el usuario.",
    });
  }
};

const iniciarSesion = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        error: "Correo y contraseña son obligatorios.",
      });
    }

    const correoNormalizado = correo.trim().toLowerCase();

    const usuario = await Usuario.findOne({
      where: {
        correo: correoNormalizado,
      },
    });

    if (!usuario) {
      return res.status(401).json({
        error: "Credenciales incorrectas.",
      });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({
        error: "Credenciales incorrectas.",
      });
    }

    const token = jwt.sign(
      {
        sub: usuario.id_usuario,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      },
    );

    const usuarioRespuesta = {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      correo: usuario.correo,
      created_at: usuario.createdAt,
    };

    return res.status(200).json({
      mensaje: "Inicio de sesión exitoso.",
      token,
      usuario: usuarioRespuesta,
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    return res.status(500).json({
      error: "Error interno al iniciar sesión.",
    });
  }
};

const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id_usuario, {
      attributes: {
        exclude: ["password"],
      },
    });

    if (!usuario) {
      return res.status(401).json({
        error: "Usuario no autorizado.",
      });
    }

    return res.status(200).json({
      usuario,
    });
  } catch (error) {
    console.error("Error al obtener perfil:", error);

    return res.status(500).json({
      error: "Error interno al obtener el perfil.",
    });
  }
};

module.exports = {
  registrar,
  iniciarSesion,
  obtenerPerfil,
};
