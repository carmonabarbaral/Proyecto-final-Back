const express = require('express');
const productRouter = require('./router/product-router');
const cartRouter = require('./router/cart-router');
const viewsRouterFn = require('./router/viewsRouter')
const socketServer = require('./utils/io')
const mongoose = require('mongoose')
const productModel = require('./dao/models/productModels')
const ProductManagerMongo = require('./dao/manager/productManagerMongo')

const path = require('path');
const handlebars = require('express-handlebars')
const hbs = handlebars.create()
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs').promises;
const productManager = new ProductManagerMongo();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 8080;
const MONGODB_CONNECT = 'mongodb+srv://barbaracarmona40:Brunito2023@cluster0.zy5f7e6.mongodb.net/ecommerce?retryWrites=true&w=majority'
mongoose.connect(MONGODB_CONNECT)
.then(()=>console.log('conexion DB'))
.catch((error) => console.log(error))


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para procesar el cuerpo de las solicitudes como JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
  req.io = io;
  next();
});



const users = []

const messages = []
io.on('connection', socket => {
  console.log('Nuevo cliente conectado', io.sockets)

  socket.on('joinChat', username => {
    users.push({
      name: username,
      socketId: socket.id
    })

    socket.broadcast.emit('notification', `${username} se ha unido al chat`)

    socket.emit('notification', `Bienvenid@ ${username}`)
    socket.emit('messages', JSON.stringify(messages))
  })

  socket.on('newMessage', message => {
    const user = users.find(user => user.socketId === socket.id)

    const newMessage = {
      message,
      user: user.name
    }
    messages.push(newMessage)

    io.emit('message', JSON.stringify(newMessage))
  }) 
})

app.get('/healthcheck', (req, res) => {
  return res.json({
    status: 'running',
    date: new Date()
  })
})

const viewsRouter = viewsRouterFn(io)

//app.use('/', viewsRouter)
// Rutas
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/products', viewsRouter)

app.get('/realTimeProducts', async (req, res) => {
  try {
    // Consultar los productos desde la base de datos de MongoDB Atlas utilizando el ProductManagerMongo
    const products = await productManager.getAllProducts();

    res.render('realTimeProducts', { productos: products });
  } catch (error) {
    console.error('Error al obtener los productos', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

app.get('/', async (req, res) => {
  try {
    // Consultar los productos desde la base de datos de MongoDB Atlas utilizando el ProductManagerMongo
    const products = await productManager.getAllProducts();

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



app.use('/', viewsRouter)

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor express escuchando en el puerto ${PORT}`);
});

//mongo db atlas


module.exports = { app, server, io };