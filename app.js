const express = require("express");
const app = express();
var logger = require("morgan");

// IMPORTAR DB
const products = require("./db/products.json");

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

const routes = require("./routes/index"); // Importamos el archivo de rutas
app.use("/", routes); // Usamos las rutas importadas en la raíz de la app

app.get("/products/:id", (req, res) => {
  try {
    const { id } = req.params;
    const product = products.find((product) => product.id === parseInt(id));
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).send("Producto no encontrado");
    }
  } catch (error) {
    console.error("Error al obtener el Producto:", error);
    res.status(500).send("Error interno del servidor");
  }
});

app.delete("/products/delete-product", (req, res) => {
  try {
    const { id } = req.query;
    const productIndex = products.findIndex(
      (product) => product.id === parseInt(id)
    );
    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      res.status(200).send("Producto eliminado");
    } else {
      res.status(404).send("Producto no encontrado");
    }
  } catch (error) {
    console.error("Error al eliminar el Producto:", error);
    res.status(500).send("Error interno del servidor");
  }
});

app.post("/products", (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;
    const newproduct = {
      id: products.length + 1,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };
    products.push(newproduct);
    res.status(201).json(newproduct);
  } catch (error) {
    console.error("Error al agregar el Producto:", error);
    res.status(500).send("Error interno del servidor");
  }
});

app.put("/products/update-product", (req, res) => {
  try {
    const { id } = req.query;
    const { title, author, year } = req.body;
    if (!title || !author || !year) {
      return res.status(400).send("Faltan datos");
    }
    const productIndex = products.findIndex(
      (product) => product.id === parseInt(id)
    );
    if (productIndex !== -1) {
      products[productIndex] = {
        id: parseInt(id),
        title,
        author,
        year,
      };
      res.status(200).json(products[productIndex]);
    } else {
      res.status(404).send("Producto no encontrado");
    }
  } catch (error) {
    console.error("Error al actualizar el Producto:", error);
    res.status(500).send("Error interno del servidor");
  }
});

app.use((req, res) => {
  res.status(404).send(
    `<div style='text-align: center; font-family: Arial;'>
          <h1>404 Not Found</h1>
          <p>La ruta solicitada no existe</p>
        </div>`
  );
});

module.exports = app;
