const Cart = require("../models/cart.model");

const getAllCarts = async () => {
  return await Cart.find();
};

const getCartById = async (id) => {
  return await Cart.findById(id);
};

const createCart = async (cart) => {
  const newCart = new Cart(cart);
  return await newCart.save();
};

const updateCart = async (id, cart) => {
  return await Cart.findByIdAndUpdate(id, cart, { new: true });
};

const deleteCart = async (id) => {
  return await Cart.findByIdAndRemove(id);
};

module.exports = {
  getAllCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
};