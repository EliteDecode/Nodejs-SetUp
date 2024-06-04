const { Router } = require("express");
const router = Router();
const DonationController = require("./DonationController");
const upload = require('../../config/multer');


const donationController = new DonationController();

router.get("/", donationController.getDonationCampaigns);
router.get("/:id", donationController.getDonationCampaignById);
router.get("/tags/:tag", donationController.getDonationCampaignsByTag);
router.post("/", upload.array('banner', 3), donationController.createDonationCampaign);
router.patch("/:id", donationController.updateDonationCampaign);
router.delete("/:id", donationController.deleteDonationCampaign);

module.exports = router;