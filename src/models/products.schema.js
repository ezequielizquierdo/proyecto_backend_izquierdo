const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, required: true },
  status: { type: Boolean, required: true },
  stock: { type: Number, required: true },
  thumbnail: { type: String, required: true },
});

module.exports = mongoose.model("Products", productsSchema);
