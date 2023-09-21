const express = require('express')
const passport = require('passport')
const sessionController = require ('../controllers/sessionControllers')


const sessionRouter = express.Router()


sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), sessionController.githubAuth)
sessionRouter.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), sessionController.githubAuthCallback)
sessionRouter.post('/register',passport.authenticate('register', {failureRedirect: '/failRegister'}),sessionController.register)
sessionRouter.get('/failRegister', sessionController.failRegister)
sessionRouter.post('/login', passport.authenticate('login', {failureRedirect: '/failLogin'}), sessionController.login)
sessionRouter.get('/failLogin', sessionController.failLogin)
sessionRouter.get('/logout', sessionController.logout)
sessionRouter.post('/logout', sessionController.logout)
sessionRouter.post('/recovery-password', sessionController.recoveryPassword)
sessionRouter.get('/current', sessionController.current)

module.exports = sessionRouter