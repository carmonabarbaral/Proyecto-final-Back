const express = require('express');
const userModels = require('../models/users.model');
const multer = require('multer');

const documentsRouter = express.Router();

// Configuración del middleware de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = `documents`;
    cb(null, `${__dirname}/uploads/${folder}`);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Middleware de Multer
const upload = multer({ storage });

// Ruta para subir documentos
documentsRouter.post('/:uid/documents', upload.single('document'), async (req, res) => {
  // Obtener el usuario
  const user = await userModels.findById(req.params.uid);

  // Guardar el documento en el servidor
  const document = await upload.single('document').save();
  user.documents.push(document.filename);
  await user.save();

  // Devolver un mensaje de éxito
  return res.json({ message: 'Documento cargado correctamente' });
});

module.exports = documentsRouter;