const { Router } = require('express');
const CartManagerMongo = require('../dao/manager/cartManagerMongo');
const CartManagerFile = require('../dao/manager/cartManagerfile');
const USE_MONGO_DB = require('../config/config');

const cartRouter = Router();
const cartManager = USE_MONGO_DB ? new CartManagerMongo() : new CartManagerFile();

// Resto del código del cartRouter

// Ruta para mostrar los detalles del carrito
cartRouter.get('/:cid', async (req, res) => {
  const cid = req.params.cid;
  const cart = await cartManager.getCartById(cid);
  res.render('cart', { cart });
});

module.exports = cartRouter;