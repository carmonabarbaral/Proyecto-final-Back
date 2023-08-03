const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const productRouter = express.Router();

const productsFilePath = path.join(__dirname, '..','components','product.json');



// Obtener todos los productos
productRouter.get('/', async (req, res) => {

    try {
      const data = await fs.readFile('productsFilePath', 'utf8');
      const products = JSON.parse(data);
  
      res.json(products);
  
    } catch (error) {
      console.error('Error al obtener los productos', error);
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  });
  // Obtener un producto por ID
productRouter.get('/:pid', async (req, res) => {

    const productId = parseInt(req.params.pid)
  
    try {
      const data = await fs.readFile(productsFilePath, 'utf8');
      const products = JSON.parse(data);
      const product = products.find((p) => p.id === productId);
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
  
      const data = await fs.readFile(productsFilePath, 'utf8');
      const productos = JSON.parse(data);
  
      if (productos.length > 0) {
        const ultimoProducto = productos[productos.length - 1];
        nuevoProducto.id = ultimoProducto.id + 1;
      } else {
        nuevoProducto.id = 1;
      }
      productos.push(nuevoProducto);
      console.log('Producto agregado al arreglo:', nuevoProducto);
      await fs.writeFile(productsFilePath, JSON.stringify(productos, null, 2), 'utf8');
      console.log('Producto agregado al archivo:', nuevoProducto);

        // Emitir el evento "productosActualizados" a través del socket
    req.io.emit('productosActualizados', { productos });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al agregar el producto', error);
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

// Actualizar producto del array
productRouter.put('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedProduct = req.body;

  try {
    const data = await fs.readFile(productsFilePath, 'utf8');
    const products = JSON.parse(data);
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex !== -1) {
      const existingProduct = products[productIndex];
      const updatedFields = Object.keys(updatedProduct);

      updatedFields.forEach((field) => {
        if (field !== 'id') {
          existingProduct[field] = updatedProduct[field];
        }
      });

      await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
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
  const productId = parseInt(req.params.pid);

  try {
    const data = await fs.readFile(productsFilePath, 'utf8');
    let products = JSON.parse(data);
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex !== -1) {
      const deletedProduct = products[productIndex];

      products.splice(productIndex, 1);
      await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
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