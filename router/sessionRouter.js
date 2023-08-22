const express = require('express')
const userModels = require('../dao/models/userModels')
const sessionRouter = express.Router()



sessionRouter.get('/', (req, res) => {
  return res.json(req.session)
  
})


sessionRouter.post('/register', async (req, res) => {
  const user = await userModels.create(req.body)

  return res.redirect('/login')
  //return res.status(201).json(user)
})

sessionRouter.post('/login', async (req, res) => {
  let user = await userModels.findOne({ email: req.body. email })

  if (!user) {
    return res.status(401).json({
      error: 'El usuario no existe en el sistema'
    })
  }

  if (user.password !== req.body.password) {
    return res.status(401).json({
      error: 'Datos incorrectos'
    })
  }

  user = user.toObject()

  delete user.password

  req.session.user = user 
  
  return res.redirect('/profile')
})

module.exports = sessionRouter