const products = require("../db/products.json");

const getAllProducts = () => {
    console.log("products - ", products);
    return products.length ? products : null
};

module.exports = { getAllProducts };