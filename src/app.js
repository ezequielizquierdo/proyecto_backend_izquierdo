const express = require("express");
require("dotenv").config();

//MONGOOSE
const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

const path = require("path");
const app = express();
const logger = require("morgan");
const multer = require("multer");
const routes = require("./routes");
const configureHandlebars = require("./config/handlebars");

// CONFIGURACION DE SERVIDOR HTTP
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server); // Importación sobre el servidor http de express

// CONFIGURACION DE CORS - Dominios que pueden acceder a esta API
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// MIDDELWARES
app.use(express.json()); // Middleware para parsear JSON en las peticiones HTTP . Para cuando nos pasan data por body, sino no lo parsea y no lo lee
app.use(express.urlencoded({ extended: true })); // Middleware para parsear los datos de los formularios en las peticiones HTTP. Es una data que viene de un formulario
app.use(logger("dev")); // Middleware para mostrar en consola las peticiones HTTP que llegan al servidor

// CONEXION A LA BASE DE DATOS
mongoose
  .connect(MONGO_URI)
  .then(() => 
    console.log("Conexión a la base de datos Mongo Atlas exitosa")
)
  .catch((err) =>
    console.log("Error al conectar a la base de datos Mongo Atlas", err)
  );

// CONFIGURACION DE HANDLEBARS
configureHandlebars(app); // Configuracion de handlebars con partials para reutilizar codigo y configuracion de la carpeta de vistas

// CONFIGURACION DE STATIC
app.use(express.static(path.join(__dirname, "public"))); // Configuracion de la carpeta public como estatica para acceder a los archivos

// RUTAS DE LA API
app.use("/api", routes(io));

// CONFIGURACION STORAGE CON MULTER
const storageConfig = multer.diskStorage({
  // Configuracion de almacenamiento
  destination: (req, file, cb) => {
    // Destino de los archivos
    cb(null, path.resolve(__dirname, "./uploads")); // Directorio donde se guardan los archivos
  },
  filename: (req, file, cb) => {
    // Nombre de los archivos
    const uploadedFileName = `img-${req.params.id}-${Date.now()}+${
      file.originalname
    }`;
    cb(null, uploadedFileName); // Nombre de los archivos guardados.
  },
});

// MIDDLEWARE PARA LA SUBIDA DE ARCHIVOS
const upload = multer({ storage: storageConfig }); // Configuracion de multer para subir archivos


module.exports = app;
