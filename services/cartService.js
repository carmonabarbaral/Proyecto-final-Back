const CartManagermongo = require('../dao/manager/cartManagerMongo');
const CartManagerfile = require('../dao/manager/cartManagerfile')
const USE_MONGO_DB = require('../config/config')
const cartManager = USE_MONGO_DB ? new CartManagermongo() : new CartManagerfile();

async function getCart() {
    try {
        const carts = await cartManager.getCarts();
        return carts;
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener los carritos');
    }
}

async function getCartById(cid) {
    try {
        const cart = await cartManager.getCartById(cid);
        return cart;
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener el carrito');
    }
}

async function addCart() {
    try {
        const newCart = await cartManager.addCart();
        return newCart;
    } catch (error) {
        console.error(error);
        throw new Error('Error al agregar el carrito');
    }
}


async function addProductToCart(cid, pid) {
    try {
        await cartManager.addProductToCart(cid, pid);
    } catch (error) {
        console.error(error);
        throw new Error('Error al agregar el producto al carrito');
    }
}

async function removeProductFromCart(cid, pid) {
    try {
        await cartManager.removeProductFromCart(cid, pid);
    } catch (error) {
        console.error(error);
        throw new Error('Error al eliminar el producto del carrito');
    }
}

async function updateCart(cartId, updatedProducts) {
    try {
        await cartManager.updateCart(cartId, updatedProducts);
    } catch (error) {
        console.error(error);
        throw new Error('Error al actualizar el carrito');
    }
}

async function updateProductQuantity(cid, pid, quantity) {
    try {
        await cartManager.updateProductQuantity(cid, pid, quantity);
    } catch (error) {
        console.error(error);
        throw new Error('Error al actualizar la cantidad del producto');
    }
}

module.exports = {
    getCart,
    getCartById,
    addCart,
    addProductToCart,
    removeProductFromCart,
    updateCart,
    updateProductQuantity
}