const express = require("express");
const router = express.Router();

const products = require("./product.routes");
// const carts = require("./carts.route");

router.get("/", function (req, res, next) {
  res.send(
    `<div style='text-align: center; margin-top: 20%; font-size: 2em; font-family: Arial;'>
    <h1>¡Bienvenido a la API de Productos deportivos !</h1>
    <p>Para ver todos los productos disponibles, ve a <a href="http://localhost:8080/api/products">/products</a></p>
    </div>`
  );
});

router.use("/products", products);
// router.use("/carts", carts);

module.exports = router;
