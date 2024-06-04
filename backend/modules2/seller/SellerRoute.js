const SellerRouter = require("express").Router();
const authMiddleware = require("../../middlewares/AuthMiddleware");
const SellerController = require("./SellerController");
const upload = require("../../config/multer");


const sellerController = new SellerController();

SellerRouter.post("/send-code",authMiddleware,sellerController.sendCode)
SellerRouter.post("/resend-code",authMiddleware,sellerController.resendCode)
SellerRouter.post("/create-business",authMiddleware,sellerController.createBusiness)
SellerRouter.post("/billing/:id",authMiddleware,sellerController.billing)
SellerRouter.get("/get-business",authMiddleware,sellerController.getBusiness)
SellerRouter.post("/verify-business",upload.single(),authMiddleware,sellerController.getBusiness)

module.exports = SellerRouter;