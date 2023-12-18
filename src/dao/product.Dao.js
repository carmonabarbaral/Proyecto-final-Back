const Product = require('../models/product.model');

const getAllProducts = async (limit) => {
  try {
    let query = Product.find(); // Crea la consulta inicial

    // Verifica si 'limit' está definido y es un número válido
    if (limit && !isNaN(parseInt(limit, 10))) {
      query = query.limit(parseInt(limit, 10)); // Aplica el 'limit' a la consulta
    }

    return await query.exec(); // Ejecuta la consulta y devuelve los resultados
  } catch (err) {
    throw new Error(err.message);
  }
};

const getProductById = async (productId) => {
  return await Product.findById(productId);
};

const createProduct = async (productData) => {
  const newProduct = new Product(productData);
  return await newProduct.save();
};

const updateProduct = async (productId, updatedData) => {
  return await Product.findByIdAndUpdate(productId, updatedData, { new: true });
};

const deleteProduct = async (productId) => {
  return await Product.findByIdAndDelete(productId);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};