const cartService = require('../services/cartService');
const ticketService = require('../services/TicketService');

const getAllCarts = async (req, res) => {
    try {
      const carts = await cartService.getAllCarts();
      res.json(carts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  const getCartById = async (req, res) => {
    try {
      const cart = await cartService.getCartById(req.params.id);
      res.json(cart);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  const createCart = async (req, res) => {
    try {
      const cart = await cartService.createCart(req.body);
      res.json(cart);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  const updateCart = async (req, res) => {
    try {
      const cart = await cartService.updateCart(req.params.id, req.body);
      res.json(cart);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  const deleteCart = async (req, res) => {
    try {
      const cart = await cartService.deleteCart(req.params.id);
      res.json(cart);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  const addProductToCart = async (req, res) => {
    try {
      const { id, pid } = req.params;
      const { quantity } = req.body;
  
      if (!id || !pid) {
        return res.status(400).json({ message: "Missing required data" });
      }
  
      const result = await cartService.addProductToCart(
        id,
        pid,
        Number(quantity) || 1
      );
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  const purchaseCart = async (req, res) => {
    try {
      const cid = req.params.cid;
      const cart = await cartService.getCartById(cid);
  
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      // Validar stock
      const products = cart.products;
      for (const product of products) {
        const productData = await productService.findById(product.productId);
        if (productData.stock < product.quantity) {
          return res.status(400).send("No hay suficiente stock del producto");
        }
      }
  
      // Crear ticket
      const ticketData = {
        code: uuid.v4(),
        purchase_datatime: new Date(),
        amount: cart.total,
        purchaser: cart.user,
      };
      const ticket = await ticketService.create(ticketData);
  
      // Restar stock
      for (const product of products) {
        const productData = await productService.findById(product.productId);
        productData.stock -= product.quantity;
        await productService.update(productData);
      }
  
      // Eliminar carrito
      await cartService.delete(cid);
  
      res.status(201).json({ ticket });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  module.exports = {
    getAllCarts,
    getCartById,
    createCart,
    updateCart,
    deleteCart,
    addProductToCart,
    purchaseCart,
  };