const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

router.get("/", cartController.getAllCarts);
router.post("/", cartController.createCart);
router.get("/:cid", cartController.getCartById);
router.put("/:cid", cartController.updateCartProducts);
router.post("/:cid/product/:pid", cartController.addProductToCart);
router.put("/:cid/products/:pid", cartController.updateProductQuantity);
router.delete("/:cid", cartController.deleteCartById);
router.delete("/:cid/products/:pid", cartController.removeProductFromCart);

module.exports = router;