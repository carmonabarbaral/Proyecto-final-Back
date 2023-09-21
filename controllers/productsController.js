const productService = require('../services/productService');

async function getAllProducts(req, res) {
    try {
        const products = await productService.getAllProducts()
        res.json(products);
    } catch (error) {
        console.error(error);
    res.status(500).json({ error: 'Error al obtener los productos' });
    }
}

async function getProductById(req, res) {
    const pid = req.params.id;
    try {
        const product = await productService.getProductById(pid)
        res.json(product);
    } catch (error) {
        console.error(error);
    res.status(500).json({ error: 'Error al obtener el producto' });
    }
}

async function addProduct(req, res) {
    const body = req.body;
    try {
        const product = await productService.addProduct(body)
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
    res.status(500).json({ error: 'Error al agregar el producto' });
    }
}

async function updateProduct(req, res) {
    const pid = req.params.id;
    const body = req.body;
    try {
        const product = await productService.updateProduct(pid, body)
        res.json(product);
    } catch (error) {
        console.error(error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
    }
}

async function deleteProduct(req, res) {
    const pid = req.params.id;
    try {
        const product = await productService.deleteProduct(pid)
        res.json(product);
    } catch (error) {
        console.error(error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
}