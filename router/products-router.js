const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");
const authorizationMiddleware = require ('../middleware/authMiddleware')

router.get('/', productsController.getAllProducts);
router.get('/:pid', productsController.getProductById);
router.post('/add', productsController.addProduct);
router.put('/update/:id', productsController.updateProduct);
router.delete('/delete/:id', productsController.deleteProduct);
module.exports =  router