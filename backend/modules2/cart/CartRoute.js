const { addToCart, increaseCartItem, decreaseCartItem, clearCart, getCart } = require("./CartController");
const CartRouter = require("express").Router();

CartRouter.post("/add-to-cart",addToCart);
CartRouter.get("/cart",getCart);
CartRouter.patch("/increase-item",increaseCartItem);
CartRouter.patch("/decrease-item",decreaseCartItem);
CartRouter.delete("/clear-cart",clearCart);

module.exports = CartRouter;