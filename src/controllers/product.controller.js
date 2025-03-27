const ProductManager = require("../managers/productManager");
const path = require("path");
const Products = require("../models/products.schema");


const productManager = new ProductManager();

module.exports = (io) => ({
  getProducts: async (req, res) => {
    try {
      const { limit = 10, page = 1, query, sort } = req.query;
      const filter = {};

      if (query) {
        if (query === "available") {
          filter.status = true;
        } else {
          filter.category = query;
        }
      }
  
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {},
      };

      const result = await Products.paginate(filter, options);
  
      const baseUrl = `${req.protocol}://${req.get("host")}${req.originalUrl.split("?")[0]}`;
      const prevLink = result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}&limit=${limit}&query=${query || ""}&sort=${sort || ""}` : null;
      const nextLink = result.hasNextPage ? `${baseUrl}?page=${result.nextPage}&limit=${limit}&query=${query || ""}&sort=${sort || ""}` : null;
  
      res.status(200).json({
        status: "success",
        payload: result.docs, // Productos obtenidos
        totalPages: result.totalPages, // Total de páginas
        prevPage: result.prevPage, // Página anterior
        nextPage: result.nextPage, // Página siguiente
        page: result.page, // Página actual
        hasPrevPage: result.hasPrevPage, // Indicador para saber si la página previa existe
        hasNextPage: result.hasNextPage, // Indicador para saber si la página siguiente existe
        prevLink, // Link directo a la página previa
        nextLink, // Link directo a la página siguiente
      });
    } catch (error) {
      console.error("Error al obtener los productos con paginación:", error);
      res.status(500).json({ status: "error", error: "Error al obtener los productos" });
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
      res.status(500).json({ error: "Error al obtener el producto" });
    }
  },

  getCategories: async (req, res) => {
    try {
      const categories = await Products.distinct("category");
      if (!categories || categories.length === 0) {
        return res.status(404).json({ error: "No se encontraron categorías" });
      }
      res.status(200).json({ success: true, categories });
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
      res.status(500).json({ error: "Error al obtener las categorías" });
    }
  },

  createProduct: async (req, res) => {
    try {
      const data = req.body;
  
      const productData = {
        ...data,
        status: data.status !== undefined ? data.status : true,
        code: data.code || `PRD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        stock: data.stock !== undefined ? data.stock : 0,
      };
  
      if (!productData.title || !productData.description || !productData.category || !productData.price || !productData.thumbnail) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
      }
  
      const product = await productManager.save(productData);
  
      io.emit("productAdded", product);
  
      res.status(200).json({ success: true, product });
    } catch (error) {
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
        return res
          .status(400)
          .json({ error: "Error al actualizar el producto" });
      }

      res.status(200).json({ success: true, product });
    } catch (error) {
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
      res.status(500).json({ error: "Error al eliminar el producto" });
    }
  },

  renderIndex: async (req, res) => {
    try {
      const products = await productManager.getAll();
      res.render("index", { products });
    } catch (error) {
      res.status(500).json({ error: "Error al renderizar la vista" });
    }
  },
});
