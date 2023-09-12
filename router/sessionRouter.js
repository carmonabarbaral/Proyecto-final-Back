const express = require('express')
const passport = require('passport')

const userModels = require('../dao/models/userModels')

const {createHash, isValidPassword} = require('../utils/passwordHash')

const sessionRouter = express.Router()


// sessionRouter.use('/', authController);

// sessionRouter.get('/',(req, res) =>{
//     return res.json(req.session)
//     if(!req.session.counter){
//         req.session.counter = 1
//         req.session.name = req.query.name

//         return res.json(`bienvenido ${req.session.name}`)
//     } else {
//         req.session.counter++
//         return res.json(`${req.session.name} has visitado la pagina ${req.session.counter} veces`)
//     }
// })

sessionRouter.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res) =>{
  console.log('GitHub authentication initiated');
})

sessionRouter.get('/github-callback', passport.authenticate('github', {failureRedirect: '/login'}), async(req, res) => {
  console.log('GitHub authentication callback received');
  req.session.user = req.user;
  console.log('User in session:', req.session.user);

  console.log('User data:', req.user);

  return res.render('profile', { user: req.user, showHeader: true });
})

sessionRouter.post('/register',
passport.authenticate('register', {failureRedirect: '/failRegister'}),
async(req, res) => {
    const body = req.body
    body.password = createHash(body.password)
    console.log('Solicitud de registro recibida'); 
    console.log({ body })
    

    if (req.query.client === 'view') {
      return res.redirect('/sessions/login')
    }

    return res.redirect('/sessions/login')
    // return res.status(201).json(req.user)
})


sessionRouter.get('/failregister', (req, res) => {
    return res.json({
      error: 'Error al registrarse'
    })
  })


sessionRouter.post('/login',
passport.authenticate('login', {failureRedirect: '/faillogin'}),
async(req, res) => {
    let user = await userModels.findOne({ email: req.body.email })

  if (!user) {
    return res.status(401).json({
      error: 'El usuario no existe en el sistema'
    })
  }

  if (!isValidPassword(req.body.password, user.password)) {
    return res.status(401).json({
      error: 'Datos incorrectos'
    })
  }

  user = user.toObject()

  delete user.password

  req.session.user = user

  return res.json(user)
})


sessionRouter.get('/faillogin', (req, res) => {
  return res.json({
    error: 'Error al iniciar sesión'
  })
})
sessionRouter.get('/current', (req, res) => {
  if (req.isAuthenticated()) { // Verificar si el usuario está autenticado
    // req.user contiene la información del usuario autenticado
    return res.json({ user: req.user });
  } else {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }
});


sessionRouter.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            return res.status(500).json({ error: "Error al cerrar sesión" });
        }
        return res.redirect('/sessions/login'); 
    });
});

sessionRouter.post('/recovery-password', async (req, res) => {

    let user = await userModels.findOne({ email: req.body.email })
  
    if (!user) {
      return res.status(401).json({
        error: 'El usuario no existe en el sistema'
      })
    }
  
    const newPassword = createHash(req.body.password)
    await userModels.updateOne({ email: user.email }, { password: newPassword })
  
    return res.redirect('/login')
  
  })

module.exports = sessionRouter