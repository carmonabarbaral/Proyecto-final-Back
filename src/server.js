const express = require("express");
const path = require("path");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const swaggerJsDocs = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");
const MongoDB = require("./dao/mongo/database/database");
const handleSocketConnection = require("./utils/socket.handler");
const initializePassport = require("./config/passport-config");
const settings = require("./command/command");
const errorMiddleware = require("./middleware/error.middleware");
const addLogger = require("./utils/logger");
const cors = require("cors");

const app = express();

MongoDB.getConnection(settings);

app.use(addLogger);
app.use(cors());

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación de Shop - Easy",
      description: "API para gestión de eccomerce",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJsDocs(swaggerOptions); //especificaciones
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs)); //url donde va a estar disponible la documentación

// Middleware para el manejo de JSON y datos enviados por formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

// Configuración handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// Seteo de forma estática la carpeta public
app.use(express.static(__dirname + "/public"));

// Crear el servidor HTTP
const PORT = settings.port || 3000;
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor express escuchando en el puerto ${PORT}`);
});

// Crear el objeto `io` para la comunicación en tiempo real
const io = new Server(httpServer);
handleSocketConnection(io);

// Ruta de health check
app.get("/healthCheck", (req, res) => {
  res.json({
    status: "running",
    date: new Date(),
  });
});

app.get("/loggerTest", (req, res) => {
  //Desarrollo
  req.logger.debug("Prueba de Desarrollo");

  //Producción
  req.logger.info("Prueba en producción de consola");
  req.logger.error("Prueba en producción de log en archivo");

  res.send({ message: "Prueba de logger!" });
});

// Implementación de enrutadores
const ProductsRouter = require("./router/product.router");
const productsRouter = new ProductsRouter(io);
const CartsRouter = require("./router/cart.router");
const cartsRouter = new CartsRouter();
const ViewsRouter = require("./router/views.router");
const viewsRouter = new ViewsRouter();
const UsersRouter = require("./router/user.router");
const usersRouter = new UsersRouter();
const SessionRouter = require("./router/session.router");
const sessionRouter = new SessionRouter();
const PaymentsRouter = require("./router/payment.router");
const paymentsRouter = new PaymentsRouter();

// Rutas base de enrutadores
app.use("/api/products", productsRouter.getRouter());
app.use("/api/carts", cartsRouter.getRouter());
app.use("/api/users", usersRouter.getRouter());
app.use("/api/sessions", sessionRouter.getRouter());
app.use("/api/payments", paymentsRouter.getRouter());
app.use("/", viewsRouter.getRouter());

app.use(errorMiddleware);

module.exports = io;