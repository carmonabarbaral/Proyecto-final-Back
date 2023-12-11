const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')


const FileStore = require('session-file-store')
const MongoStore = require('connect-mongo')
const swaggerUIExpress = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const fs = require("fs");
const swagger = fs.readFileSync("./swagger.yaml", "utf8");
const productViewRouter = require("./src/router/ProductsViewsRouter");
const ProductsRouter = require("./src/router/products-router");
const cartRouter = require ('./src/router/cart-router')
const cartViewRouter = require('./src/router/cartViewRouter');
const sessionRouter = require('./src/router/sessionRouter')
//const sessionViewRouter = require('./src/router/sessionViewRouter')
const messageRouter = require("./src/router/messenger-router");
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
const jwtMiddleware = require('./middleware/jwtMiddleware');
const productsMockers = require('./src/mocking/mocking');
//const errorHandler = require ('./middleware/errorHandler');
const logger = require('./utils/loggers');
const forgotPasswordRouter = require('./src/router/forgot-router');
const documentsRouter = require('./src/router/document-router');




const app = express();

const fileStorage = FileStore(session)

const passport = require('./src/config/passport-config');

// Configuración handlebars
app.set('view engine', 'handlebars');
app.set('views', '../../views');

app.use(cookieParser('secretkey'))


const config = require('./src/config/config');

const MONGODB_CONNECT =
  `mongodb+srv://${config.mongo.user}:${config.mongo.password}@cluster0.zy5f7e6.mongodb.net/${config.mongo.name}retryWrites=true&w=majority`;
mongoose
  .connect(MONGODB_CONNECT)
  .then(() => console.log("conexion DB"))
  .catch((error) => console.log(error));


  const options = {
    swaggerDefinition: {
      info: {
        title: 'Mi API',
        version: '1.0.0',
      },
    },
    apis: ['./router/productsRouter.js', './router/cartRouter.js'],
  };
  
  // Llama a la función `swaggerJSDoc` y pasa la variable `options` como argumento
const specs = swaggerJSDoc(options);
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
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
//app.use(errorHandler.CustomError);
//app.use(errorHandler.defaultErrorHandler);
app.use(logger)

app.use("/api/products",ProductsRouter);
app.use("/products", productViewRouter);
app.use("/api/carts", cartRouter);
app.use("/cart", cartViewRouter);
app.use('/api/current', jwtMiddleware);
app.use('/api/sessions', sessionRouter)
//app.use('/sessions', sessionViewRouter)
app.use("/api/messages", messageRouter);
app.use("/messages/new", (req, res) =>
  res.render("messageForm", { message: {} })
);
app.use("/api/loggerTest", (req, res) => {
  app.get('/loggerTest', (req, res) => {
    logger.debug('Este es un mensaje de debug.');
    logger.info('Este es un mensaje de información.');
    logger.warn('Este es un mensaje de advertencia.');
    logger.error('Este es un mensaje de error.');
    logger.fatal('Este es un mensaje fatal.');
  
    res.send('Todos los logs se han enviado correctamente.');
  });
});

app.use("/api/forgot-password",forgotPasswordRouter);

app.use("/messages/edit/:id", messageRouter);
app.use('/api-docs', swaggerUIExpress.serve, swaggerUIExpress.setup(swagger));
app.use('/api/documents', documentsRouter);
app.get("/", (req, res) => {
  res.json({
    status: "running",
  });
});

app.get('/failRegister', (req, res) => {
  // Muestra un mensaje de error personalizado al usuario

  res.render('failRegister');
});

app.get('/mockingProducts', (req, res) => {
  res.json(productsMockers);
});




const PORT = `${config.url.port}`;
app.listen(PORT, () => console.log(`servidor corriendo en puerto ${PORT}`));

