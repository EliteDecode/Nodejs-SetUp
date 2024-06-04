const ReviewController = require("./ReviewController");
const ReviewRouter = require("express").Router();

const authMiddleware = require("../../middlewares/AuthMiddleware")

const reviewController = new ReviewController;

ReviewRouter.post("/",authMiddleware,reviewController.postReview);
// ReviewRouter.get("/",reviewController.getAllProductReview)

module.exports = ReviewRouter;