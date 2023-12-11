const fs = require('fs').promises;
const path = require('path');
const filePath = path.join(__dirname, '../../components/product.json');

class ProductManagerFile {
  async getAllProducts() {
    try {
      const productsData = await fs.readFile(filePath, 'utf-8');
      const products = JSON.parse(productsData);
      return products;
    } catch (error) {
      console.error('Error while adding the product', error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const productsData = await fs.readFile(filePath, 'utf-8');
      const products = JSON.parse(productsData);
      const product = products.find((p) => p.id === id);
      return product || null;
    } catch (error) {
      return null;
    }
  }

  async addProduct(body) {
    try {
      const productsData = await fs.readFile(filePath, 'utf-8');
      const products = JSON.parse(productsData);
      const lastProductId = products.length > 0 ? parseInt(products[products.length - 1].id) : 0;
      const newProduct = {
        id: (lastProductId + 1).toString(), // Simple way to generate a unique ID (you can use a better approach in a real application)
        code: body.code,
        stock: body.stock,
        title: body.title,
        price: body.price,
        category: body.category,
        thumbnails: body.thumbnails,
        description: body.description,
        status: body.status,
      };
      products.push(newProduct);
      await fs.writeFile(filePath, JSON.stringify(products, null, 2), 'utf-8');
      return newProduct;
    } catch (error) {
      throw new Error('Error while adding the product');
    }
  }

  async updateProduct(id, body) {
    try {
      const productsData = await fs.readFile(filePath, 'utf-8');
      const products = JSON.parse(productsData);
      const productIndex = products.findIndex((p) => p.id === id);
      if (productIndex !== -1) {
        const updatedProduct = { ...products[productIndex], ...body };
        products[productIndex] = updatedProduct;
        await fs.writeFile(filePath, JSON.stringify(products, null, 2), 'utf-8');
        return updatedProduct;
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      throw new Error('Error while updating the product');
    }
  }

  async deleteProduct(id) {
    try {
      const productsData = await fs.readFile(filePath, 'utf-8');
      const products = JSON.parse(productsData);
      const productIndex = products.findIndex((p) => p.id === id);
      if (productIndex !== -1) {
        const deletedProduct = products.splice(productIndex, 1)[0];
        await fs.writeFile(filePath, JSON.stringify(products, null, 2), 'utf-8');
        return deletedProduct;
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      throw new Error('Error while deleting the product');
    }
  }
}

module.exports = ProductManagerFile;