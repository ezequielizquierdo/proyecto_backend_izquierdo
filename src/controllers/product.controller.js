const ProductManager = require("../managers/productManager");
const path = require("path");

const productManager = new ProductManager(
  path.join(__dirname, "../db/products.json")
);

module.exports = (io) => ({
  getProducts: async (req, res) => { // Obtiene todos los productos
    try {
      const products = await productManager.getAll();
      res.json(products); // Devuelve un JSON con los productos
      console.log("products en getProducts", products);
      // res.render("products", { products });
    } catch (error) {
      console.log("Error de lectura", error);
      res.status(500).json({ error: "Error al obtener los productos" });
    }
  },

  getProductById: async (req, res) => { // Obtiene un producto por ID
    const idProduct = parseInt(req.params.id, 10);
    console.log("idProduct", idProduct);
    try {
      const product = await productManager.getById(idProduct);
      console.log("product en getProductById", product);
      if (product) {
        res.json(product);
        // res.render("products", { product });
        // res.render("products", { products });
      } else {
        res.status(404).json({ error: "Producto no encontrado" });
      }
    } catch (error) {
      console.log("Error de lectura del id", error);
      res.status(500).json({ error: "Error al obtener el producto" });
    }
  },

  createProduct: async (req, res) => { // Crea un producto
    try {
      const id = await productManager.save(req.body);
      const newProduct = { id, ...req.body };
      res.json({
        ...newProduct,
        message: `El producto se agregó correctamente con ID: ${id}`,
      });
      io.emit("productAdded", newProduct); // Emitir evento de Socket.IO
    } catch (error) {
      console.log("Error de escritura", error);
      res.status(500).json({ error: "Error al agregar el producto" });
    }
  },

  updateProductById: async (req, res) => { // Actualiza un producto por ID
    const id = parseInt(req.params.id);
    const product = req.body;
    let timestamp = Date.now();
    try {
      const updatedProduct = await productManager.updateById(id, product);
      res.json({
        ...updatedProduct,
        timestamp,
        message: `El producto ID: ${id} se actualizó con éxito`,
      });
    } catch (error) {
      console.log("Error de actualización", error);
      res.status(500).json({ error: "Error al actualizar el producto" });
    }
  },

  deleteProductById: async (req, res) => { // Elimina un producto por ID
    const id = parseInt(req.params.id);
    try {
      await productManager.deleteById(id);
      res.json({ message: `El producto ID: ${id} se eliminó con éxito` });
    } catch (error) {
      console.log("Error de eliminación", error);
      res.status(500).json({ error: "Error al eliminar el producto" });
    }
  },

  renderIndex: async (req, res) => { // Renderiza la vista index de handlebars en la ruta raiz
    try {
      const products = await productManager.getAll();
      console.log("renderIndex | products", products);
      res.render("index", { products });
    } catch (error) {
      console.log("Error al renderizar la vista", error);
      res.status(500).json({ error: "Error al renderizar la vista" });
    }
  }
});