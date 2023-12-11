const cartModel = require('../src/models/cart.model');
const productModels = require('../src/models/product.model');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

class CartManagerMongo {
  constructor() {
    this.model = cartModel;
  }

  async getCarts() {
    try {
      const carts = await this.model.find();
      return carts.map((p) => p.toObject());
    } catch (error) {
      throw error;
    }
  }

  async getCartById(id) {
    try {
      console.log(`Buscando carrito con ID ${id}`);
      const cart = await this.model.findById(id).populate('products.product');

      if (!cart) {
        console.log(`Carrito con ID ${id} no encontrado`);
        return null; // No se encontró el carrito con el ID dado
      }

      const populatedCart = {
        id: cart._id,
        products: cart.products.map((productEntry) => ({
          product: {
            id: productEntry.product._id,
            code: productEntry.product.code,
            stock: productEntry.product.stock,
            title: productEntry.product.title,
            price: productEntry.product.price,
            category: productEntry.product.category,
            thumbnails: productEntry.product.thumbnails,
            description: productEntry.product.description,
            status: productEntry.product.status,
          },
          quantity: productEntry.quantity,
        })),
      };

      return populatedCart;
    } catch (error) {
      console.error('Error en getCartById:', error);
      return null; // Manejar errores en caso de que ocurra alguno
    }
  }

  async addCart() {
    try {
      const newCart = await this.model.create({ products: [] });
      return newCart;
    } catch (error) {
      throw error;
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const cart = await this.model.findById(cid);
      const product = await productModels.findById(pid);

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      if (!product) {
        throw new Error('Producto no encontrado en el stock');
      }

      const existingProductInCart = cart.products.findIndex((p) => p.product.toString() === pid);
      const productToAdd = {
        product: product._id,
        quantity: 1,
      };

      if (existingProductInCart !== -1) {
        cart.products[existingProductInCart].quantity++;
      } else {
        cart.products.push(productToAdd);
      }

      cart.markModified('products');
      await cart.save();
    } catch (error) {
      throw error;
    }
  }
  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await this.cartModel.findById(cartId);

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const productIndex = cart.products.findIndex(product => product._id.toString() === productId);

      if (productIndex === -1) {
        throw new Error('Producto no encontrado en el carrito');
      }

      cart.products.splice(productIndex, 1);

      await cart.save();
    } catch (error) {
      throw error;
    }
  }

  async updateCart(cartId, updatedProducts) {
    try {
      const cart = await this.cartModel.findById(cartId);

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      cart.products = updatedProducts;

      // Guarda los cambios en el carrito
      await cart.save();
    } catch (error) {
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, newQuantity) {
    try {
      const cart = await cart.findById(cartId);

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const productIndex = cart.products.findIndex(product => product.product.toString() === productId);

      if (productIndex === -1) {
        throw new Error('Producto no encontrado en el carrito');
      }

      cart.products[productIndex].quantity = newQuantity;
      await cart.save();

      return cart;
    } catch (error) {
      throw error;
    }
  }
}


module.exports = CartManagerMongo;