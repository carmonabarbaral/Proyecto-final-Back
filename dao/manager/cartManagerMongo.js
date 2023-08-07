const cartModel = require('../models/cartModels')
const productModel = require('../models/productModels')
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
      const product = await productModel.findById(pid);

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
}

module.exports = CartManagerMongo;