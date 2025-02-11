const ProductManager = require('../managers/productManager');
const path = require('path');

const productManager = new ProductManager(path.join(__dirname, '../db/products.json'));

module.exports = {
  getProducts: async (req, res) => {
    try {
      const products = await productManager.getAll(); 
      res.json(products); 
    } catch (error) {
      console.log("Error de lectura", error);
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  },

  getProductById: async (req, res) => {
    const idProduct = parseInt(req.params.id);
    try {
      const product = await productManager.getById(idProduct);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      console.log("Error de lectura del id", error);
      res.status(500).json({ error: 'Error al obtener el producto' });
    }
  },

  createProduct: async (req, res) => {
    try {
      const id = await productManager.save(req.body);
      res.json({ id, ...req.body, message: `El producto se agregó correctamente con ID: ${id}` });
    } catch (error) {
      console.log("Error de escritura", error);
      res.status(500).json({ error: 'Error al agregar el producto' });
    }
  },

  updateProductById: async (req, res) => {
    const id = parseInt(req.params.id);
    const product = req.body;
    let timestamp = Date.now();
    try {
      const updatedProduct = await productManager.updateById(id, product);
      res.json({ ...updatedProduct, timestamp, message: `El producto ID: ${id} se actualizó con éxito` });
    } catch (error) {
      console.log("Error de actualización", error);
      res.status(500).json({ error: 'Error al actualizar el producto' });
    }
  },

  deleteProductById: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      await productManager.deleteById(id);
      res.json({ message: `El producto ID: ${id} se eliminó con éxito` });
    } catch (error) {
      console.log("Error de eliminación", error);
      res.status(500).json({ error: 'Error al eliminar el producto' });
    }
  }
};