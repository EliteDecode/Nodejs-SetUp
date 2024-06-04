const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct,getProductOfSeller} = require("./ProductController");
const upload = require("../../config/multer");
const { protectRoute } = require("../../middlewares/AuthMiddleware");
const router = require("express").Router();

router.post("/product",protectRoute, upload.array('image',4),createProduct);
router.get("/product",getAllProducts);
router.get("/product/seller/:id",getProductOfSeller);
router.get("/product/:id",getProduct);
router.patch("/product/:id",protectRoute, upload.array('image',4), updateProduct);
// router.patch("/product/upload-image/:id",protectRoute,upload.single("image"),uploadImage);
// router.patch("/product/delete-image/:id",protectRoute,deleteImage);
router.delete("/product/:id",protectRoute,deleteProduct);

module.exports = router;