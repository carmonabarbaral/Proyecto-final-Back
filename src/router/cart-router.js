const express = require('express');
const cartRouter = express.Router();
const cartController = require('../controllers/cartController');

cartRouter.get('/', cartController.getAllCarts);
cartRouter.get('/:id', cartController.getCartById);
cartRouter.post('/', cartController.createCart);
cartRouter.put('/:id', cartController.updateCart);
cartRouter.delete('/:id', cartController.deleteCart);
cartRouter.post('/:id/products/:pid', cartController.addProductToCart);

module.exports = cartRouter;