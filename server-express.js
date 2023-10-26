const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const jwt = require('express-jwt');

const FileStore = require('session-file-store')
const MongoStore = require('connect-mongo')

const productViewRouter = require("./router/ProductsViewsRouter");
const cartRouter = require ('./router/cart-router')
const cartViewRouter = require("./router/cartViewRouter");
const sessionRouter = require('./router/sessionRouter')
const sessionViewRouter = require('./router/sessionViewRouter')
const messageRouter = require("./router/messenger-router");
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
const jwtMiddleware = require('./middleware/jwtMiddleware');
const productsMockers = require('./mocking/mocking');
const errorHandler = require ('./middleware/errorHandler');
const loggers = require('./utils/loggers');
const forgotPassword = require('./config/forgotPassword');


const app = express();

const fileStorage = FileStore(session)

const passport = require('./config/initializePassport');

// Configuración handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");


app.use(cookieParser('secretkey'))

const config = require('./config/config')

const MONGODB_CONNECT =
  `mongodb+srv://${config.mongo.user}:${config.mongo.password}@cluster0.zy5f7e6.mongodb.net/${config.mongo.name}retryWrites=true&w=majority`;
mongoose
  .connect(MONGODB_CONNECT)
  .then(() => console.log("conexion DB"))
  .catch((error) => console.log(error));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
  store: MongoStore.create({
    mongoUrl: MONGODB_CONNECT,
    ttl: 180
  }),
  secret: `${config.session.secret}`,
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(errorHandler ());

app.use("/api/products", productsRouter);
app.use("/products", productViewRouter);
app.use("/api/carts", cartRouter);
app.use("/cart", cartViewRouter);
app.use('/api/current', jwtMiddleware);
app.use('/api/sessions', sessionRouter)
app.use('/sessions', sessionViewRouter)
app.use("/api/messages", messageRouter);
app.use("/messages/new", (req, res) =>
  res.render("messageForm", { message: {} })
);
app.use ("/api/loggerTest");
app.use ("/api/forgot-password");

app.use("/messages/edit/:id", messageRouter);

app.get("/", (req, res) => {
  res.json({
    status: "running",
  });
});

app.get('/mockingProducts', (req, res) => {
  res.json(productsMockers);
});

app.get('/loggerTest', (req, res) => {
  logger.debug('Este es un mensaje de debug.');
  logger.info('Este es un mensaje de información.');
  logger.warn('Este es un mensaje de advertencia.');
  logger.error('Este es un mensaje de error.');
  logger.fatal('Este es un mensaje fatal.');

  res.send('Todos los logs se han enviado correctamente.');
});
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    await forgotPassword(email);

    res.json({
      message: 'Se envió un enlace de restablecimiento de contraseña a tu correo electrónico.',
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

const PORT = `${config.url.port}`;
app.listen(PORT, () => console.log(`servidor corriendo en puerto ${PORT}`));

