const { Router } = require('express');
const CartManagerMongo = require('../dao/manager/cartManagerMongo');
const CartManagerfile = require('../dao/manager/cartManagerfile');
const cartRouter = Router();

const USE_MONGO_DB = require('../config/config');
const cartManager = USE_MONGO_DB ? new CartManagerMongo() : new CartManagerfile();

cartRouter.get('/', async (req, res) => {
  const carts = await cartManager.getCarts();
  res.json(carts);
});

cartRouter.get('/:cid', async (req, res) => {
  const cid = req.params.cid;
  const cart = await cartManager.getCartById(cid);
  return res.json(cart);
});

cartRouter.post('/', async (req, res) => {
  const newCart = await cartManager.addCart();
  return res.status(201).json(newCart);
});

cartRouter.post('/:cid/products/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  try {
    await cartManager.addProductToCart(cid, pid);
    return res.json({ message: 'Product added to cart successfully' });
  } catch (error) {
    
    return console.log(error);
  }
});

module.exports = cartRouter;