const express = require('express');
const router = express.Router();
const upload = require('../../config/multer');
const ProfileController = require('./ProfileController');
const { deprecated } = require('../../middlewares/HelperMiddleware')
const profileController = new ProfileController();

router.post('/:profileId/card-info', deprecated, profileController.addCardInfo);
router.post('/:profileId/address-info', profileController.addAddressInfo);
router.put('/:profileId/theme', profileController.updateTheme);
router.put('/:profileId/bio', profileController.addBio);
router.post('/', profileController.addProfile);
router.post('/:profileId/phone-number', profileController.addPhoneNumber);
router.get('/:userId', profileController.getProfileById)
router.post('/:profileId/profile-pic', upload.single('profilePic'), profileController.addProfilePic);

module.exports = router;
