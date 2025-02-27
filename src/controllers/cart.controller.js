const CartManager = require('../managers/cartManager');
const path = require('path');

const cartManager = new CartManager(path.join(__dirname, '../db/carts.json'));

module.exports = {
  createCart: async (req, res) => {
    try {
      const cart = await cartManager.createCart();
      res.status(201).json({ message: 'Cart created successfully', cart });
    } catch (error) {
      res.status(500).json({ error: 'Error creating cart', details: error.message });
    }
  },

  getCartById: async (req, res) => {
    const cartId = parseInt(req.params.cid, 10);
    try {
      const cart = await cartManager.getCartById(cartId);
      if (cart) {
        res.json(cart);
      } else {
        res.status(404).json({ error: 'Cart not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving cart', details: error.message });
    }
  },

  addProductToCart: async (req, res) => {
    const cartId = parseInt(req.params.cid, 10);
    const productId = parseInt(req.params.pid, 10);
    try {
      const cart = await cartManager.addProductToCart(cartId, productId);
      res.json({ message: 'Product added to cart successfully', cart });
    } catch (error) {
      res.status(500).json({ error: 'Error adding product to cart', details: error.message });
    }
  }
};