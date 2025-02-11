const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);
router.get('/:pid', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:pid', productController.updateProductById);
router.delete('/:pid', productController.deleteProductById);

module.exports = router;