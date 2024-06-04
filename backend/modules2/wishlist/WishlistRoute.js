const WishlistController = require("./WishlistController");
const express = require("express");
const authMiddleware = require("../../middlewares/AuthMiddleware")

const WishlistRouter = express.Router();

const wishlistController = new WishlistController();

WishlistRouter.post("/",authMiddleware,wishlistController.addToWishlist);
WishlistRouter.get("/",authMiddleware,wishlistController.getUserWishlist);
WishlistRouter.delete("/:productId",authMiddleware,wishlistController.removeFromWishlist);

module.exports = WishlistRouter;