const express = require('express');
const productRouter = require('./router/product-router');
const cartRouter = require('./router/cart-router');

const path = require('path');
const handlebars = require('express-handlebars')
const hbs = handlebars.create()
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs').promises;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 8080;

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para procesar el cuerpo de las solicitudes como JSON
app.use(express.json());
app.use((req, res, next) => {
  req.io = io;
  next();
});


// Rutas
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);

app.get('/realTimeProducts', async (req, res) => {
  try {
    const productsFilePath = path.join(__dirname, 'components', 'product.json');
    const data = await fs.readFile(productsFilePath, 'utf8');
    const products = JSON.parse(data);

    res.render('realTimeProducts', { productos: products });
  } catch (error) {
    console.error('Error al obtener los productos', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

app.get('/', async (req, res) => {
  try {
    const productsFilePath = path.join(__dirname, 'components', 'product.json');
    const data = await fs.readFile(productsFilePath, 'utf8');
    const products = JSON.parse(data);

    res.render('home', { productos: products });
  } catch (error) {
    console.error('Error al obtener los productos', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });

  socket.on('productosActualizados', async () => {
    try {
      const productsFilePath = path.join(__dirname, 'components', 'product.json');
      const data = await fs.readFile(productsFilePath, 'utf8');
      const products = JSON.parse(data);
      socket.emit('productosActualizados', { productos }); // Emitir los productos actualizados al cliente
    } catch (error) {
      console.error('Error al obtener los productos', error);
    }
  });
});
app.set('socketio', io);

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor express escuchando en el puerto ${PORT}`);
});

module.exports = { app, server, io };