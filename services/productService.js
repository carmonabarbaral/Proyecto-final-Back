const ProductManagerMongo = require('../dao/manager/productManagerMongo')
const ProductManagerFile = require('../dao/manager/productManagerfs');
const USE_MONGO_DB = require('../config/config');
const productManager = USE_MONGO_DB ? new ProductManagerMongo() : new ProductManagerFile();

async function getAllProducts() {
    try {
        const products = await productManager.getAllProducts()
        return products;
    } catch (error) {
        console.error(error);
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
    try {
        const product = await productManager.addProduct(body)
        return product;
    } catch (error) {
        console.error(error);
        throw new Error('Error al agregar el producto');
    }
}

async function updateProduct(pid, body) {
    try {
        const product = await productManager.updateProduct(pid, body)
        return product;
    } catch (error) {
        console.error(error);
        throw new Error('Error al actualizar el producto');
    }
}

async function deleteProduct(pid) {
    try {
        const product = await productManager.deleteProduct(pid)
        return product;
    } catch (error) {
        console.error(error);
        throw new Error('Error al eliminar el producto');
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct

}