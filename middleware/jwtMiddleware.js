const jwt = require('jsonwebtoken')
const env = require('../src/config/config')

function verifyAccessToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
req.userAuth = false;
    return next();
  }


  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // En caso de error al verificar el token, redirige a la página de inicio de sesión
      req.userAuth = false;
      return next();
    }
    req.userAuth = true;
    next();
    
  });
}

module.exports = verifyAccessToken