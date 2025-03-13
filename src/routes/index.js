const express = require("express");
const router = express.Router();

const productsRouter = require("./product.router");
const cartsRouter = require("./cart.router");
const userRouter = require("./user.router");

module.exports = (io) => {
  const productController = require("../controllers/product.controller")(io);

  router.get("/render", productController.renderIndex); // Ruta para renderizar la vista con productos

  router.use("/products", productsRouter(io)); // Rutas de productos
  router.use("/users", userRouter); // Rutas de productos
  router.use("/carts", cartsRouter); // Rutas de carritos
  router.use("/vistas", userRouter); // Rutas de vistas

  return router;
};