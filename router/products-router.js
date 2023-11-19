const {Router} = require('express')
const ProductsRouter = Router();
const productsController = require("../controllers/productsController");
const AuthorizationMiddleware = require ('../middleware/authMiddleware');

ProductsRouter.get('/', productsController.getAllProducts);
ProductsRouter.get('/:pid', productsController.getProductById);
ProductsRouter.post('/add',AuthorizationMiddleware, productsController.addProduct);
ProductsRouter.put('/update/:id',AuthorizationMiddleware , productsController.updateProduct);
ProductsRouter.delete('/delete/:id',AuthorizationMiddleware, productsController.deleteProduct);
module.exports =  ProductsRouter