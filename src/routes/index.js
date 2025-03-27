const express = require("express");
const router = express.Router();

const productsRouter = require("./product.router");
const cartsRouter = require("./cart.router");
const userRouter = require("./user.router");

module.exports = (io) => {
  const productController = require("../controllers/product.controller")(io);

  router.get("/render", productController.renderIndex);

  router.use("/products", productsRouter(io));
  router.use("/users", userRouter);
  router.use("/carts", cartsRouter);
  router.use("/vistas", userRouter);

  return router;
};