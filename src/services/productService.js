const productDAO = require('../dao/product.Dao');

const getAllProducts = async (limit) => {
  return productDAO.getAllProducts(limit);
};

const getProductById = (productId) => {
  return productDAO.getProductById(productId);
};

const createProduct = (productData) => {
  return productDAO.createProduct(productData);
};

const updateProduct = (productId, updatedData) => {
  return productDAO.updateProduct(productId, updatedData);
};

const deleteProduct = (productId) => {
  return productDAO.deleteProduct(productId);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};