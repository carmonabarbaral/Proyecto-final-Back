const fs = require('fs').promises;
const path = require('path');
const filePath = path.join(__dirname, '../../components/cart.json');

class CartManagerFile {
  async getCarts() {
    try {
      const cartsData = await fs.readFile(filePath, 'utf-8');
      const carts = JSON.parse(cartsData);
      return carts;
    } catch (error) {
      return [];
    }
  }

  async getCartById(id) {
    try {
      const cartsData = await fs.readFile(filePath, 'utf-8');
      const carts = JSON.parse(cartsData);
      const cart = carts.find((c) => c._id === id);
      return cart || null;
    } catch (error) {
      return null;
    }
  }

  async addCart() {
    try {
      const cartsData = await fs.readFile(filePath, 'utf-8');
      const carts = JSON.parse(cartsData);
      const newCart = {
        id: Date.now().toString(),
        products: [],
      };
      carts.push(newCart);
      await fs.writeFile(filePath, JSON.stringify(carts, null, 2), 'utf-8');
      return newCart;
    } catch (error) {
      throw new Error('Error while adding the cart');
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const cartsData = await fs.readFile(filePath, 'utf-8');
      const carts = JSON.parse(cartsData);
      const cartIndex = carts.findIndex((c) => c.id === cid);
      const productIndex = carts[cartIndex].products.findIndex((p) => p.product === pid);

      if (cartIndex !== -1 && productIndex !== -1) {
        carts[cartIndex].products[productIndex].quantity++;
      } else if (cartIndex !== -1) {
        carts[cartIndex].products.push({ product: pid, quantity: 1 });
      } else {
        throw new Error('Cart not found');
      }

      await fs.writeFile(filePath, JSON.stringify(carts, null, 2), 'utf-8');
    } catch (error) {
      throw new Error('Error while adding the product to cart');
    }
  }
}

module.exports = CartManagerFile;