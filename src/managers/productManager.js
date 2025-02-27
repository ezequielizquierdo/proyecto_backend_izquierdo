const fs = require('fs').promises;
const path = require('path');

class ProductManager {
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

  // getAll -> Obtiene todos los productos
  async getAll() {
    await this.initializeFile();
    const data = await fs.readFile(this.path, 'utf8');
    // TODO ---> Agregar IF para verificar si data existe, sino devolver un [] vacio
    return JSON.parse(data);
  }

  // getById -> Obtiene un producto por ID
  async getById(id) {
    const products = await this.getAll();
    // TODO ---> Agregar IF para verificar si products existe, sino devolver un [] vacio
    return products.find(product => product.id === id);
  }

  // save -> Guarda un producto
  async save(product) {
    const products = await this.getAll();
    const maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
    product.id = maxId + 1;
    products.push(product);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return product.id;
  }

  // updateById -> Actualiza un producto por ID
  async updateById(id, updatedProduct) {
    const products = await this.getAll();
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct, id };
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
      return products[index];
    }
    throw new Error(`Product with ID ${id} not found`);
  }

  // deleteById -> Elimina un producto por ID
  async deleteById(id) {
    const products = await this.getAll();
    const filteredProducts = products.filter(product => product.id !== id);
    await fs.writeFile(this.path, JSON.stringify(filteredProducts, null, 2));
  }
}

module.exports = ProductManager;