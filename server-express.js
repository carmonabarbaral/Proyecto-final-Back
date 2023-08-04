const express = require('express');

const productsRouter = require('./router/products-router')
const productViewRouter = require('./router/ProductsViewsRouter')
const cartRouter = require('./router/cart-router');
const cartViewRouter = require('./router/cartViewRouter')

const mongoose = require('mongoose')
const handlebars = require('express-handlebars')

const app = express();

// Configuración handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

const MONGODB_CONNECT = 'mongodb+srv://barbaracarmona40:Brunito2023@cluster0.zy5f7e6.mongodb.net/ecommerce?retryWrites=true&w=majority'
mongoose.connect(MONGODB_CONNECT)
.then(()=>console.log('conexion DB'))
.catch((error) => console.log(error))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.use('/api/products', productsRouter)
app.use('/products', productViewRouter)
app.use('/api/carts', cartRouter)
app.use('/cart', cartViewRouter)

app.get('/', (req, res) => {
  res.json({
      status: 'running',
      
  })
})

const PORT = 3000;
app.listen(PORT, () => console.log(`servidor corriendo en puerto ${PORT}`))

// const express = require('express');
// const productRouter = require('./router/products-router');
// const cartRouter = require('./router/cart-router');

// const path = require('path');
// const handlebars = require('express-handlebars')
// const hbs = handlebars.create()
// const http = require('http');
// const socketIO = require('socket.io');
// const fs = require('fs').promises;
// const mongoose = require('mongoose')

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

// const MONGODB_CONNECT = 'mongodb+srv://romerodisind:coder2023@cluster0.c9jlz11.mongodb.net/ecommerce?retryWrites=true&w=majority'
// mongoose.connect(MONGODB_CONNECT)
// .then(()=>console.log('conexion DB'))
// .catch((error) => console.log(error))

// const PORT = 8081;

// app.engine('handlebars', hbs.engine);
// app.set('view engine', 'handlebars');
// app.set('views', path.join(__dirname, 'views'));

// // Middleware para procesar el cuerpo de las solicitudes como JSON
// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
// app.use(express.static('public'));

// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // Rutas
// app.use('/api/products', productRouter);
// app.use('/api/cart', cartRouter);

// app.get('/realtimeproducts', async (req, res) => {
//   try {
//     const productsFilePath = path.join(__dirname, 'database', 'products.json');
//     const data = await fs.readFile(productsFilePath, 'utf8');
//     const products = JSON.parse(data);

//     res.render('realtimeproducts', { productos: products });
//   } catch (error) {
//     console.error('Error al obtener los productos', error);
//     res.status(500).json({ error: 'Error al obtener los productos' });
//   }
// });

// app.get('/', async (req, res) => {
//   try {
//     const productsFilePath = path.join(__dirname, 'database', 'products.json');
//     const data = await fs.readFile(productsFilePath, 'utf8');
//     const products = JSON.parse(data);

//     res.render('home', { productos: products });
//   } catch (error) {
//     console.error('Error al obtener los productos', error);
//     res.status(500).json({ error: 'Error al obtener los productos' });
//   }
// });



// app.use(express.static(path.join(__dirname, 'public')));

// io.on('connection', (socket) => {
//   console.log('Cliente conectado');

//   socket.on('disconnect', () => {
//     console.log('Cliente desconectado');
//   });

//   socket.on('productosActualizados', async () => {
//     try {
//       const productsFilePath = path.join(__dirname, 'database', 'products.json');
//       const data = await fs.readFile(productsFilePath, 'utf8');
//       const products = JSON.parse(data);
//       socket.emit('productosActualizados', { productos }); // Emitir los productos actualizados al cliente
//     } catch (error) {
//       console.error('Error al obtener los productos', error);
//     }
//   });
// });

// app.set('socketio', io);

// // Iniciar el servidor
// server.listen(PORT, () => {
//   console.log(`Servidor express escuchando en el puerto ${PORT}`);
// });

// module.exports = { app, server, io };