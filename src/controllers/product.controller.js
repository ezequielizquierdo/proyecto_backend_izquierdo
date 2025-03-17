const ProductManager = require("../managers/productManager");
const path = require("path");

const productManager = new ProductManager();

module.exports = (io) => ({

  getProducts: async (req, res) => {
    try {
      const products = await productManager.getAll();
      res.status(200).json({ success: true, products });
    } catch (error) {
      console.log("Error de lectura", error);
      res.status(500).json({ error: "Error al obtener los productos" });
    }
  },

  getProductById: async (req, res) => {
    const { id } = req.params;
    try {
      const product = await productManager.getById(id);
      if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.status(200).json({ success: true, product });
    } catch (error) {
      console.log("Error de lectura del id", error);
      res.status(500).json({ error: "Error al obtener el producto" });
    }
  },

  createProduct: async (req, res) => {
    try {
      const data = req.body;
      const { title, description, category, price, status, stock, thumbnail } =
        data;

      if (
        !title ||
        !description ||
        !category ||
        !price ||
        !status ||
        !stock ||
        !thumbnail
      ) {
        return res.status(400).json({ error: "Faltan datos" });
      }

      const product = await productManager.save(data);
      if (!product) {
        return res.status(400).json({ error: "Error al guardar el producto" });
      }
      res.status(200).json({ success: true, product });
    } catch (error) {
      console.log("Error de escritura", error);
      res.status(500).json({ error: "Error al agregar el producto" });
    }
  },

  updateProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      if (!id) {
        return res.status(400).json({ error: "No se recibió el ID" });
      }
      if (!data) {
        return res.status(400).json({ error: "No se recibieron datos" });
      }
      const product = await productManager.updateById(id, data);
      if (!product) {
        return res.status(400).json({ error: "Error al actualizar el producto" });
      }
      console.log("product", product);
      console.log("id", id);
      console.log("data", data);
    
      res.status(200).json({ success: true, product });
    } catch (error) {
      console.log("Error de actualización", error);
      res.status(500).json({ error: "Error al actualizar el producto" });
    }
  },

  deleteProductById: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "No se recibió el ID" });
      }
      const product = await productManager.deleteById(id);
      if (!product) {
        return res.status(400).json({ error: "Error al eliminar el producto" });
      }
      res.status(200).json({ success: true, product });
    } catch (error) {
      console.log("Error de eliminación", error);
      res.status(500).json({ error: "Error al eliminar el producto" });
    }
  },


  renderIndex: async (req, res) => {
    try {
      const products = await productManager.getAll();
      console.log("renderIndex | products", products);
      res.render("index", { products });
    } catch (error) {
      console.log("Error al renderizar la vista", error);
      res.status(500).json({ error: "Error al renderizar la vista" });
    }
  },
});
