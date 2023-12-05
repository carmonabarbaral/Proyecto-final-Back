const { Router } = require('express');
const forgotPassword = require('../config/forgot-Password');
const forgotPasswordRouter = Router();



forgotPasswordRouter.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    try {
      await forgotPassword(email);
  
      res.json({
        message: 'Se envió un enlace de restablecimiento de contraseña a tu correo electrónico.',
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  });

module.exports = forgotPasswordRouter;