const fs = require("fs").promises;
const path = require("path");
const Products = require("../models/products.schema");
const mongoose = require("mongoose");

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

  async getAll() {
    try {
      if (!Products) throw new Error("No se encontraron productos");
      const products = await Products.find(
        {},
        "title description category price status stock thumbnail"
      );
      return products;
    } catch (error) {
      console.log("Error al obtener los productos", error);
    }
  }

  async getById(id) {
    try {
      if (!id) throw new Error("No se recibió el ID");
      if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("ID inválido");

      const product = await Products.findById(id);
      return product;
    } catch (error) {
      console.log("Error al obtener el producto", error);
    }
  }

  async save(product) {
    try {
      if (!product) throw new Error("No se recibió el producto");
      const newProduct = new Products(product);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      console.log("Error al guardar el producto", error);
    }
  }

  async updateById(id, data) {
    try {
      if (!data) throw new Error("No se recibió el producto");
      if (!id) throw new Error("No se recibió el ID");
      if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("ID inválido");

      const updated = await Products.findByIdAndUpdate(id, data, { new: true }); // new: true devuelve el producto actualizado
      return updated;
    } catch (error) {
      console.log("Error al actualizar el producto", error);
    }
  }

  async deleteById(id) {
    try {
      if (!id) throw new Error("No se recibió el ID");
      if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("ID inválido");
      const deleteProduct = await Products.findByIdAndDelete(id);
      return deleteProduct;
    } catch (error) {
      console.log("Error al eliminar el producto", error);
    }
  }
}

module.exports = ProductManager;
