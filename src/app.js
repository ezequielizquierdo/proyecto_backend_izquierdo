const express = require("express");
const handlebars = require("express-handlebars");
const path = require("path");
const app = express();
const logger = require("morgan");
const multer = require("multer");
const routes = require("./routes");
const vistasRouter = require("./routes/vistas.routes");

// MIDDELWARES
app.use(express.json()); // Middleware para parsear JSON en las peticiones HTTP . Para cuando nos pasan data por body, sino no lo parsea y no lo lee
app.use(express.urlencoded({ extended: true })); // Middleware para parsear los datos de los formularios en las peticiones HTTP. Es una data que viene de un formulario
app.use(logger("dev")); // Middleware para mostrar en consola las peticiones HTTP que llegan al servidor

// Los middlewares son funciones que se ejecutan antes de que lleguen a las rutas
// Los middlewares se ejecutan en el orden en el que se declaran

function miMiddleWare (req, res, next) {
  console.log("Middleware in / : ", new Date());
  next();
}

// app.use(miMiddleWare); // Aplicamos el middleware a todas las rutas


// CONFIGURACION DE CORS - Dominios que pueden acceder a esta API
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// CONFIGURACION STORAGE CON MULTER
const storageConfig = multer.diskStorage({ // Configuracion de almacenamiento
  destination: (req, file, cb) => { // Destino de los archivos
    cb(null, path.resolve(__dirname, "./uploads")); // Directorio donde se guardan los archivos
  },
  filename: (req, file, cb) => { // Nombre de los archivos
    const uploadedFileName = `img-${req.params.id}-${Date.now()}+${file.originalname}`;
    cb(null, uploadedFileName); // Nombre de los archivos guardados.
  }
});

// MIDDLEWARE PARA LA SUBIDA DE ARCHIVOS
const upload = multer({ storage: storageConfig }); // Configuracion de multer para subir archivos

// CONFIGURACION DE STATIC
app.use(express.static(path.join(__dirname, "public"))); // Middleware para servir archivos estaticos
app.use("/static", express.static(path.join(__dirname, "public"))); // Prueba para MULTER hacia la carpeta public
// app.use(express.static(path.join(__dirname, "views"))); // MULTER CON VIEWS

// CONFIGURACION DE HANDLEBARS
app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));

// CONFIGURACION DE VIEWS
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// RUTAS DE VISTAS 
app.use("/vistas", vistasRouter);

// RUTA RAIZ
app.get("/", miMiddleWare, (req, res) => { // Cuando renderice la raiz del proyecto renderiza el index con el objeto testUser y ejecuta el middleware miMiddleWare
  let testUser = { name: "Ezequiel", last_name: "Izquierdo" };
  res.render("index", testUser);
});

// SUBIDA DE ARCHIVOS
app.post("/uploads", upload.single("file"), (req, res) => {
  try {
    req.file ? console.log("Archivo subido correctamente 111", req.file) : console.log("Error al subir el archivo", req.file);
    res.send("Archivo subido correctamente");
  } catch (error) {
    res.send("Error al subir el archivo");
  }
});

// RUTAS DE LA API
app.use("/api", routes);
app.use("/vistas", vistasRouter);

module.exports = app;