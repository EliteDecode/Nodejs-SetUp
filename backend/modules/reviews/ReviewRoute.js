const { postReview, getAllReview, getReview, updateReview, deleteReview } = require("./ReviewController");

const ReviewRouter = require("express").Router();


ReviewRouter.post("/review",postReview);
// ReviewRouter.get("/review",getAllReview);
// ReviewRouter.get("/review/:id",getReview);
// ReviewRouter.patch("/review/:id",updateReview);
// ReviewRouter.delete("/review/:id",deleteReview);


module.exports = ReviewRouter;