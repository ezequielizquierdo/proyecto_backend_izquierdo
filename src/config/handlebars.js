const handlebars = require("express-handlebars");
const path = require("path");

module.exports = (app) => {
  app.engine(
    "handlebars",
    handlebars.engine({
      defaultLayout: "main",
      partialsDir: path.join(__dirname, "../views", "partials"),
    })
  ); // Configuracion de handlebars con partials para reutilizar codigo
  app.set("view engine", "handlebars"); // Configuracion de handlebars como motor de vistas
  app.set("views", path.join(__dirname, "../views")); // Configuracion de la carpeta de vistas
};