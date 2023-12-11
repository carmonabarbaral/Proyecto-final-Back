const cartDAO = require("../dao/cart.Dao");

const getAllCarts = () => {
  return cartDAO.getAllCarts();
};

const getCartById = (cartId) => {
  return cartDAO.getCartById(cartId);
};

const createCart = (cartData) => {
  return cartDAO.createCart(cartData);
};

const updateCart = (cartId, updatedData) => {
  return cartDAO.updateCart(cartId, updatedData);
};

const deleteCart = (cartId) => {
  return cartDAO.deleteCart(cartId);
};

const addProductToCart = async (cartId, productId, quantity = 1) => {
  const cart = await getCartById(cartId);
  if (!cart) {
    throw new Error("Cart not found");
  }
  const existingProductIndex = cart.products.findIndex(
    (product) => product.productId.toString() === productId
  );

  if (existingProductIndex !== -1) {
    cart.products[existingProductIndex].quantity += quantity;
  } else {
    cart.products.push({ productId, quantity });
  }

  return await cartDAO.updateCart(cartId, { products: cart.products });
};

module.exports = {
  getAllCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
  addProductToCart,
};