const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.post('/', cartController.createCart);
router.get('/:cid', cartController.getCartById);
router.post('/:cid/product/:pid', cartController.addProductToCart);

module.exports = router;