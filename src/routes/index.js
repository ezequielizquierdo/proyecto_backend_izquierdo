const express = require("express");
const router = express.Router();

const products = require("./product.routes");
const carts = require("./cart.routes");
const user = require("./vistas.routes");

router.get("/", function (req, res, next) { // Ruta raiz de /api que muestra un mensaje de bienvenida
  res.send(
    `<div style='text-align: center; margin-top: 20%; font-size: 2em; font-family: Arial;'>
    <h1>¡Bienvenido a la API de Productos deportivos !</h1>
    <p>Para ver todos los productos disponibles, ve a <a href="http://localhost:8080/api/products">/products</a></p>
    </div>`
  );
});

router.use("/products", products); // Rutas de productos
router.use("/carts", carts); // Rutas de carritos
router.use("/vistas", user); // Rutas de vistas

module.exports = router;
