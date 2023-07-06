const express = require('express');
const fs = require('fs').promises;

const cartRouter = express.Router();

// Crear carrito
cartRouter.post('/', async (req, res) => {
  try {
    const data = await fs.readFile('./components/carts.json', 'utf8');
    const carts = JSON.parse(data);

    let lastCartId = 0;
    if (carts.length > 0) {
      const lastCart = carts[carts.length - 1];
      lastCartId = parseInt(lastCart.id);
    }

    const newCartId = (lastCartId + 1).toString();

    const newCart = {
      id: newCartId,
      products: []
    };

    carts.push(newCart);

    await fs.writeFile('./components/carts.json', JSON.stringify(carts, null, 2), 'utf8');

    res.status(201).json(newCart);
  } catch (error) {
    console.error('Error al crear el carrito', error);
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

// Obtener carrito por ID
cartRouter.get('/:cid', async (req, res) => {

  try {
    const data = await fs.readFile('./components/carts.json', 'utf8');
    const carts = JSON.parse(data);

    const cartId = req.params.cid;

    const cart = carts.find((c) => c.id === cartId);

    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el carrito', error);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

// Agregar producto al carrito
cartRouter.post('/:cid/product/:pid', async (req, res) => {
  try {
    // Leer el archivo carts.json
    const data = await fs.readFile('./components/carts.json', 'utf8');
    const carts = JSON.parse(data);

    const cartId = req.params.cid;
    const productId = req.params.pid;

    const cart = carts.find((c) => c.id === cartId);

    if (cart) {
      const existingProduct = cart.products.find((p) => p.product === productId);

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.products.push({
          product: productId,
          quantity: 1
        });
      }

      await fs.writeFile('./components/carts.json', JSON.stringify(carts, null, 2), 'utf8');

      res.json(cart);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    console.error('Error al agregar el producto al carrito', error);
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

module.exports = cartRouter;