const mongoose = require("mongoose");
const Carts = require("../models/carts.schema");

class CartManager {
  async createCart() {
    try {
      const newCart = new Carts({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      throw error;
    }
  }

  async getCartById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID de carrito inválido");
      }
      const cart = await Carts.findById(id).populate({
        path: "products.product",
        select: "title price category",
      });
      return cart;
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      throw error;
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(cartId) ||
        !mongoose.Types.ObjectId.isValid(productId)
      ) {
        throw new Error("ID inválido");
      }

      const cart = await Carts.findById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
      throw error;
    }
  }

  async deleteCartById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("ID inválido");
      const deletedCart = await Carts.findByIdAndDelete(id);
      return deletedCart;
    } catch (error) {
      console.error("Error al eliminar el carrito:", error);
      throw error;
    }
  }

  async getAllCarts() {
    try {
      const carts = await Carts.find().populate("products.product");
      return carts;
    } catch (error) {
      console.error("Error al obtener los carritos:", error);
      throw error;
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await this.getCartById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      cart.products = cart.products.filter(
        (item) => item.product.toString() !== productId
      );

      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
      throw error;
    }
  }
}

module.exports = CartManager;
