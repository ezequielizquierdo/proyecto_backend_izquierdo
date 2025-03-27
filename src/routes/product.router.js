const express = require('express');

module.exports = (io) => {
  const router = express.Router();
  const productController = require('../controllers/product.controller')(io);
  
  router.get("/categories", productController.getCategories);
  
  router.get('/', productController.getProducts);
  router.get('/:id', productController.getProductById);
  router.post('/', productController.createProduct);
  router.put('/:id', productController.updateProductById);
  router.delete('/:id', productController.deleteProductById);

  return router;
};