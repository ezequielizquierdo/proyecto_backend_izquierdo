const mongoose = require("mongoose");
const CartManager = require("../managers/cartManager");
const path = require("path");

const cartManager = new CartManager(path.join(__dirname, "../db/carts.json"));

module.exports = {
  createCart: async (req, res) => {
    try {
      const cart = await cartManager.createCart();
      res.status(201).json({ message: "Cart created successfully", cart });
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      res
        .status(500)
        .json({ error: "Error creating cart", details: error.message });
    }
  },

  getCartById: async (req, res) => {
    const cartId = req.params.cid;
    try {
      if (!mongoose.Types.ObjectId.isValid(cartId)) {
        return res.status(400).json({ error: "ID de carrito inválido" });
      }

      const cart = await cartManager.getCartById(cartId);
      if (cart) {
        res.json(cart);
      } else {
        res.status(404).json({ error: "Carrito no encontrado" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al obtener el carrito", details: error.message });
    }
  },

  getAllCarts: async (req, res) => {
    try {
      const carts = await cartManager.getAllCarts();
      res.status(200).json({ success: true, carts });
    } catch (error) {
      console.error("Error al obtener los carritos:", error);
      res
        .status(500)
        .json({
          error: "Error al obtener los carritos",
          details: error.message,
        });
    }
  },

  addProductToCart: async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
      if (
        !mongoose.Types.ObjectId.isValid(cartId) ||
        !mongoose.Types.ObjectId.isValid(productId)
      ) {
        return res
          .status(400)
          .json({ error: "ID de carrito o producto inválido" });
      }

      const cart = await cartManager.addProductToCart(cartId, productId);

      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      res
        .status(200)
        .json({ message: "Producto agregado al carrito correctamente", cart });
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
      res
        .status(500)
        .json({
          error: "Error al agregar el producto al carrito",
          details: error.message,
        });
    }
  },

  removeProductFromCart: async (req, res) => {
    const { cid, pid } = req.params;
  
    try {
      if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).json({ error: "ID de carrito o producto inválido" });
      }
  
      const cart = await cartManager.getCartById(cid);
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
  
      const productIndex = cart.products.findIndex((item) => item.product._id.toString() === pid);
      if (productIndex === -1) {
        return res.status(404).json({ error: "Producto no encontrado en el carrito" });
      }
  
      if (cart.products[productIndex].quantity > 1) {
        cart.products[productIndex].quantity -= 1;
      } else {
        cart.products.splice(productIndex, 1);
      }
  
      await cart.save();
  
      res.status(200).json({ success: true, message: "Producto actualizado en el carrito", cart });
    } catch (error) {
      console.error("Error al actualizar el producto del carrito:", error);
      res.status(500).json({ error: "Error al actualizar el producto del carrito", details: error.message });
    }
  },

  updateCartProducts: async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
  
    try {
      if (!mongoose.Types.ObjectId.isValid(cid)) {
        return res.status(400).json({ error: "ID de carrito inválido" });
      }
  
      if (!Array.isArray(products)) {
        return res.status(400).json({ error: "El cuerpo debe contener un arreglo de productos" });
      }
  
      const cart = await cartManager.getCartById(cid);
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
  
      cart.products = products.map((product) => ({
        product: product.productId,
        quantity: product.quantity,
      }));
  
      await cart.save();
  
      res.status(200).json({ success: true, message: "Carrito actualizado correctamente", cart });
    } catch (error) {
      console.error("Error al actualizar los productos del carrito:", error);
      res.status(500).json({ error: "Error al actualizar los productos del carrito", details: error.message });
    }
  },

  updateProductQuantity: async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
  
    try {
      if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).json({ error: "ID de carrito o producto inválido" });
      }
  
      if (typeof quantity !== "number" || quantity <= 0) {
        return res.status(400).json({ error: "La cantidad debe ser un número mayor a 0" });
      }
  
      const cart = await cartManager.getCartById(cid);
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
  
      const productIndex = cart.products.findIndex((item) => item.product.toString() === pid);
      if (productIndex === -1) {
        return res.status(404).json({ error: "Producto no encontrado en el carrito" });
      }
  
      cart.products[productIndex].quantity = quantity;
  
      await cart.save();
  
      res.status(200).json({ success: true, message: "Cantidad actualizada correctamente", cart });
    } catch (error) {
      console.error("Error al actualizar la cantidad del producto:", error);
      res.status(500).json({ error: "Error al actualizar la cantidad del producto", details: error.message });
    }
  },

  deleteCartById: async (req, res) => {
    try {
      const { cid } = req.params;

      if (!cid) {
        return res
          .status(400)
          .json({ error: "El ID del carrito es obligatorio" });
      }

      const cart = await cartManager.deleteCartById(cid);

      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      res
        .status(200)
        .json({
          success: true,
          message: "Carrito eliminado correctamente",
          cart,
        });
    } catch (error) {
      console.error("Error al eliminar el carrito:", error);
      res
        .status(500)
        .json({
          error: "Error al eliminar el carrito",
          details: error.message,
        });
    }
  },
};
