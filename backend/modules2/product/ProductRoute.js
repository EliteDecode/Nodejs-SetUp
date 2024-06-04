const upload = require("../../config/multer");
const ProductController = require("./ProductController");
const ProductRouter = require("express").Router();
const authMiddleware = require("../../middlewares/AuthMiddleware")

const productController = new ProductController()

ProductRouter.post("/",authMiddleware, upload.array('image',4),productController.createProduct);
ProductRouter.get("/",productController.getAllProduct);
ProductRouter.get("/:id",productController.getProduct);
// ProductRouter.patch("/product/:id",protectRoute,updateProduct);
ProductRouter.delete("/:id",authMiddleware,productController.deleteProduct);

module.exports = ProductRouter;