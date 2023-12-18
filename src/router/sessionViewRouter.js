const express = require('express');
const sessionViewRouter = express.Router();
const verifyTokenMiddleware = require('../../middleware/jwtMiddleware');

sessionViewRouter.get('/login', (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
      return res.redirect('/products');
    }
    res.render('login');
  });



  
  sessionViewRouter.get('/register', (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
      return res.redirect('/products');
    }
    res.render('register');
  });

module.exports = sessionViewRouter;