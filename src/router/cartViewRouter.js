const { Router } = require('express');
const CartManagerMongo = require('../../manager/cartManagerMongo');
const CartManagerFile = require('../../manager/cartManagerFile');
const USE_MONGO_DB = require('../../src/config/config');

const cartRouter = Router();
const cartManager = USE_MONGO_DB ? new CartManagerMongo() : new CartManagerFile();



// Ruta para mostrar los detalles del carrito
cartRouter.get('/:cid', async (req, res) => {
  const cid = req.params.cid;
  console.log ("Carrito con id:", cid)
  const cart = await cartManager.getCartById(cid);
  res.render('cart', { cart });
});

module.exports = cartRouter;