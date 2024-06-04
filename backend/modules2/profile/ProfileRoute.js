const ProfileRouter = require("express").Router();
const authMiddleware = require("../../middlewares/AuthMiddleware");
const ProfileController = require("./ProfileController");

const profileController = new ProfileController();

ProfileRouter.post("/create-address",authMiddleware,profileController.addAddress)
ProfileRouter.get("/user-address",authMiddleware,profileController.getAddress)
ProfileRouter.patch("/edit-address/:id",authMiddleware,profileController.editAddress)
ProfileRouter.delete("/delete-address/:id",authMiddleware,profileController.deleteAddress)

module.exports = ProfileRouter;