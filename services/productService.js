const ProductManagerMongo = require('../dao/manager/productManagerMongo')
const ProductManagerFile = require('../dao/manager/productManagerfs');
const USE_MONGO_DB = require('../config/config');
const logger = require('../utils/loggers');
const productManager = USE_MONGO_DB ? new ProductManagerMongo() : new ProductManagerFile();

async function getAllProducts() {
    logger.info('Recibida una petición GET a /products');
    try {
        const products = await productManager.getAllProducts()
        return products;
        
    } catch (error) {
        logger.error(error);
        throw new Error('Error al obtener los productos');
    }
}

async function getProductById(pid) {
    try {
        const product = await productManager.getProductById(pid)
        return product;
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener el producto');
    }
}

async function addProduct(body) {
    // Verificar que el usuario tenga el rol premium
    try {
      if (!req.user.premium) {
        throw new Error('No tienes permiso para crear productos');
      }
    } catch (error) {
      return res.status(403).json({ error });
    }
  
    // Agregar el producto
    const product = await productManager.addProduct(body);
  
    return product;
  }
  
  // Método updateProduct()
  
  async function updateProduct(pid, body) {
    // Obtener el producto
    const product = await productManager.getProductById(pid);
  
    // Verificar que el usuario sea el propietario del producto o que tenga el rol admin
    try {
      if (product.owner !== req.user.email && !req.user.admin) {
        throw new Error('No tienes permiso para modificar este producto');
      }
    } catch (error) {
      return res.status(403).json({ error });
    }
  
    // Modificar el producto
    const updatedProduct = await productManager.updateProduct(pid, body);
  
    return updatedProduct;
  }
  
  // Método deleteProduct()
  
  async function deleteProduct(pid) {
    // Obtener el producto
    const product = await productManager.getProductById(pid);
  
    // Verificar que el usuario sea el propietario del producto o que tenga el rol admin
    try {
      if (product.owner !== req.user.email && !req.user.admin) {
        throw new Error('No tienes permiso para eliminar este producto');
      }
    } catch (error) {
      return res.status(403).json({ error });
    }
  
    // Eliminar el producto
    await productManager.deleteProduct(pid);
  
    return;
  }

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct

}