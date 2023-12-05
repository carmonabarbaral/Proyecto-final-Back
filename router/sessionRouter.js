
const express = require('express');
const passport = require('passport');
const sessionController = require('../controllers/sessionControllers');

const sessionRouter = express.Router();

sessionRouter.post('/register', passport.authenticate('register', { failureRedirect: '/failRegister' }), sessionController.register);
sessionRouter.post('/login', passport.authenticate('local', { failureRedirect: '/failLogin' }), sessionController.login);
sessionRouter.get('/logout', sessionController.logout);
sessionRouter.post('/logout', sessionController.logout);
sessionRouter.post('/recovery-password', sessionController.recoveryPassword);
sessionRouter.get('/current', sessionController.current); // La protección JWT se maneja a nivel de aplicación

module.exports = sessionRouter;
