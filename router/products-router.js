const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");
const AuthorizationMiddleware = require ('../middleware/authMiddleware');


router.get('/', productsController.getAllProducts);
router.get('/:pid', productsController.getProductById);
router.post('/add',AuthorizationMiddleware, productsController.addProduct);
router.put('/update/:id',AuthorizationMiddleware , productsController.updateProduct);
router.delete('/delete/:id',AuthorizationMiddleware, productsController.deleteProduct);
module.exports =  router