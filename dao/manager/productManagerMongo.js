const express = require('express');
const productRouter = express.Router();
const productModel = require('../models/productModels');

// Obtener todos los productos
productRouter.get('/', async (req, res) => {
  try {
    const products = await productModel.find();
    res.json(products);
  } catch (error) {
    console.error('Error al obtener los productos', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Obtener un producto por ID
productRouter.get('/:pid', async (req, res) => {
  const productId = req.params.pid;

  try {
    const product = await productModel.findById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el producto', error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// Agregar producto al array
productRouter.post('/', async (req, res) => {
  try {
    const nuevoProducto = req.body;
    const productoAgregado = await productModel.create(nuevoProducto);

    // Emitir el evento "productosActualizados" a través del socket
    req.io.emit('productosActualizados', { productos });

    res.status(201).json(productoAgregado);
  } catch (error) {
    console.error('Error al agregar el producto', error);
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

// Actualizar producto del array
productRouter.put('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;

  try {
    const existingProduct = await productModel.findByIdAndUpdate(productId, updatedProduct, { new: true });

    if (existingProduct) {
      await existingProduct.save();

      io.emit('productosActualizados', { productos }); // Emitir el evento "productosActualizados" a través del socket

      res.json(existingProduct);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el producto', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Eliminar producto por ID
productRouter.delete('/:pid', async (req, res) => {
  const productId = req.params.pid;

  try {
    const deletedProduct = await productModel.findByIdAndDelete(productId);

    if (deletedProduct) {
      io.emit('productosActualizados', { productos }); // Emitir el evento "productosActualizados" a través del socket

      res.status(200).json({ message: 'Producto eliminado exitosamente', deletedProduct });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el producto', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = productRouter;
