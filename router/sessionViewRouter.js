const express = require('express')
const userModels = require('../dao/models/userModels')

const sessionViewRouter = express.Router()

const sessionMiddleware = (req, res, next) => {
    if(req.session.user){
        return  res.redirect('profile')
    }
    return next()
}

const adminMiddleware = async (req, res, next) => {
    if (req.session.user && req.session.user.admin) {
        return next();
    } else {
        return res.status(403).json({ error: "Acceso no autorizado" });
    }
};

  sessionViewRouter.get('/dashboard', adminMiddleware, (req, res) => {
    return res.render('dashboard', { showHeader: true } )
});

sessionViewRouter.get('/register', sessionMiddleware, (req, res)=> {
    return res.render('register', { showHeader: false })
})

sessionViewRouter.get('/login', sessionMiddleware, (req, res) => {
    return res.render('login', { showHeader: false })
})

sessionViewRouter.get('/profile', (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('login', { showHeader: true })
    }
  
    return next()
  }, (req, res) => {
    const user = req.session.user
    return res.render('profile', { user, showHeader: true })
  })

module.exports = sessionViewRouter