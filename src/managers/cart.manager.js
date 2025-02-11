const CartModel = require('../models/cart.model');

class CartManager {
  constructor() {
    this.cart = new CartModel();
  }

  async createCart(req, res) {
    try {
      const cart = await this.cart.createCart();
      res.status(200).send({
        status: 200,
        data: {
          cart,
        },
        message: 'Cart was created successfully',
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        messages: error.message,
      });
    }
  }

  async addProductToCart(req, res) {
    try {
      if (!req.body.id) {
        throw Error('You should add a product');
      }
      if (!req.params.id) {
        throw Error('You should choose a cart');
      }
      const idCart = parseInt(req.params.id);
      const idProduct = req.body.id;
      const cart = await this.cart.addProductToCart(idCart, idProduct);
      res.status(200).send({
        status: 200,
        data: cart,
        message: 'Product was added to Cart successfully',
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        messages: error.message,
      });
    }
  }

  async getCartById(req, res) {
    const idCart = parseInt(req.params.id);
    try {
      const data = await this.cart.getCartById(idCart);
      res.status(200).send({
        status: 200,
        data,
        message: 'Cart was obtained successfully',
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        messages: error.message,
      });
    }
  }

  async deleteCartById(req, res) {
    const idCart = parseInt(req.params.id);
    try {
      await this.cart.deleteCartById(idCart);
      res.status(200).send({
        status: 200,
        data: {
          id: idCart,
        },
        message: 'Cart was deleted successfully',
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        messages: error.message,
      });
    }
  }

  async deleteProductCart(req, res) {
    try {
      if (!req.params.id) {
        throw Error('You should choose a cart');
      }
      if (!req.params.idProd) {
        throw Error('You should add a product');
      }
      const idCart = parseInt(req.params.id);
      const idProduct = parseInt(req.params.idProd);
      const cart = await this.cart.deleteProductCart(idCart, idProduct);
      res.status(200).send({
        status: 200,
        data: cart,
        message: 'Product was deleted from Cart successfully',
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        messages: error.message,
      });
    }
  }
}

const cartManager = new CartManager();

module.exports = {
  createCart: cartManager.createCart.bind(cartManager),
  addProductToCart: cartManager.addProductToCart.bind(cartManager),
  getCartById: cartManager.getCartById.bind(cartManager),
  deleteCartById: cartManager.deleteCartById.bind(cartManager),
  deleteProductCart: cartManager.deleteProductCart.bind(cartManager),
};