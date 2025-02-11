const express = require("express");
const app = express();
var logger = require("morgan");
const routes = require("./src/routes/routes");

// MIDDELWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));

// CONFIGURACION DE CORS - Dominios que pueden acceder a esta API
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.use("/api", routes);

module.exports = app;