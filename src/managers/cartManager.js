const fs = require('fs').promises;
const path = require('path');

class CartManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async initializeFile() {
    try {
      await fs.access(this.path);
    } catch (error) {
      await fs.writeFile(this.path, JSON.stringify([]));
    }
  }

  // createCart -> Crea un carrito vacío
  async createCart() {
    await this.initializeFile();
    const data = await fs.readFile(this.path, 'utf8');
    const carts = JSON.parse(data);

    // Crear un nuevo carrito con ID y productos vacíos
    const newCart = {
      id: carts.length ? carts[carts.length - 1].id + 1 : 1, // Si hay carritos, el ID es el último + 1, si no hay, el ID es 1
      products: []
    };

    carts.push(newCart); 
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  // getCartById -> Obtiene un carrito por ID
  async getCartById(id) {
    await this.initializeFile();
    const data = await fs.readFile(this.path, 'utf8');
    const carts = JSON.parse(data);
    return carts.find(cart => cart.id === id);
  }

  // addProductToCart -> Agrega un producto a un carrito
  async addProductToCart(cartId, productId) {
    await this.initializeFile();
    const data = await fs.readFile(this.path, 'utf8');
    const carts = JSON.parse(data);

    const cart = carts.find(cart => cart.id === cartId); // Buscar el carrito por ID en el array de carritos
    if (!cart) { // Si no se encuentra el carrito, lanzar un error
      throw new Error(`Cart with ID ${cartId} not found`);
    }

    const productIndex = cart.products.findIndex(product => product.id === productId); // Buscar el producto en el carrito
    if (productIndex !== -1) { // Si el producto ya está en el carrito, aumentar la cantidad
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ id: productId, quantity: 1 }); // Si el producto no está en el carrito, agregarlo con cantidad 1
    }

    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }
}

module.exports = CartManager;