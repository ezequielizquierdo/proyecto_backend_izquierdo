const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, index: true },
  price: { type: String, required: true },
  status: { type: Boolean, default: true },
  stock: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  code: { type: String, default: function () {
    return `PRD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }}, 
});

productsSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Products", productsSchema);