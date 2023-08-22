const {Router} = require('express');
const productManagerMongo = require('../dao/manager/productManagerMongo');
const cartsManagerMongo = require('../dao/manager/cartManagerMongo');
const UserManagerMongo = require('../dao/manager/userManagerMongo');
const UserModel = require('../dao/models/userModels');

const viewsRouter = Router()

// Middleware de sesión
const sessionMiddleware = (req, res, next) => {
  if (!req.session.user) {
      return res.redirect('/login'); // Redirige si no hay sesión de usuario
  }
  return next();
};

// Ruta para registrar un nuevo usuario
viewsRouter.post('/register', async (req, res) => {
  try {
      const { name, email, password } = req.body;
      const newUser = new UserModel({ name, email, password });
      await newUser.save();
      res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
      console.error('Error al registrar usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }

});

viewsRouter.get('/register', sessionMiddleware, (req, res) => {
  return res.render('register');
});

// Ruta para el inicio de sesión
viewsRouter.post('/login', async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });

      if (!user || !user.validPassword(password)) {
          return res.status(401).json({ error: 'Credenciales incorrectas' });
      }
      req.session.user = user;
      res.json({ message: 'Inicio de sesión exitoso', user });
  } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});


viewsRouter.get('/login', (req, res) => {

  return res.render('login');
});

// Ruta para cerrar sesión
viewsRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.error('Error al cerrar sesión:', err);

          return res.status(500).json({ error: 'Error interno del servidor' });
      }
      res.json({ message: 'Cierre de sesión exitoso' });
})
}
);


module.exports = viewsRouter