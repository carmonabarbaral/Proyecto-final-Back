const { Router } = require('express');
const cartController = require('../controllers/cartController');
const cartRouter = Router();

cartRouter.get('/', cartController.getCart);
cartRouter.get('/:cid', cartController.getCartById);
cartRouter.post('/addToCart', cartController.addProductToCart);
cartRouter.post('/:cid/purchase', cartController.purchaseCart);
cartRouter.delete('/:cid/products/:pid', cartController.removeProductFromCart);
cartRouter.put('/:cid', cartController.updateCart);
cartRouter.put('/:cid/products/:pid', cartController.updateProductQuantity);

module.exports = cartRouter;