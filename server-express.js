const express = require('express');
const productRouter = require('./router/product-router');
const cartRouter = require('./router/cart-router');

const app = express();
const PORT = 8080;

// Middleware para procesar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Rutas
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor express escuchando en el puerto ${PORT}`);
  });