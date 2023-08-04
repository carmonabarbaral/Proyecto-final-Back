const {Router} = require('express')
const ProductManagerMongo = require('../dao/manager/productManagerMongo')
const ProductManagerFile = require('../dao/manager/productManagerfs');
const productsViewsRouter = Router()

const USE_MONGO_DB = require('../config/config');
const productManager = USE_MONGO_DB ? new ProductManagerMongo() : new ProductManagerFile();



productsViewsRouter.get('/', async(req, res) => {
    const products = await productManager.getAllProducts()
    console.log({ products })
    return res.render('../../products', { products })
})

module.exports = productsViewsRouter

/*const viewsRouterFn = (io) => {
  const viewsRouter = new Router()

  const usernames = []

  viewsRouter.get('/login', (req, res) => {
    return res.render('login')
  })

  viewsRouter.post('/login', (req, res) => {
    const user = req.body

    const username = user.name

    usernames.push(username)

    // io.emit('newUser', username)

    return res.redirect(`/chat?username=${username}`)
  })

  viewsRouter.get('/chat', (req, res) => {
    return res.render('index')
  })

  return viewsRouter
}

module.exports = viewsRouterFn*/
