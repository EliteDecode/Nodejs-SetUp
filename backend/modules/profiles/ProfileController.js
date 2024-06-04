const cloudinary = require('cloudinary').v2;
const ProfileService = require('./ProfileService');

const cloudinaryFolder = process.env.CLD_FOLDER_ONE || "";
const profileService = new ProfileService();

class ProfileController {
    async addCardInfo(req, res) {
       try {
           const { cardNumber, cardName, expiryDate } = req.body;
           const { profileId } = req.params;
           const updatedProfile = await profileService.addCardInfo(profileId , cardNumber, cardName, expiryDate);
           res.status(200).json({success: true, message: "Card data added Successfully.", data: updatedProfile});
       } catch (error) {
           res.status(500).json({ success: false, error: {
            code: 'SERVER_ERROR',
            message: error.message
           } });
       }
    }

    async addProfile(req, res) {
        try {
            const { userId } = req.body;
            const newProfile = await profileService.createProfile(userId);
            res.status(200).json({success: true, data: newProfile, message: "Profile created successfully."});
        } catch (error) {
            res.status(500).json({ success: false, error: {
                code: 'SERVER_ERROR',
                message: error.message
               } });
        }
    }

    async addPhoneNumber (req, res) {
        try {
            const { profileId } = req.params;
            const { phoneNumber } = req.body;
            const updatedProfile = await profileService.addPhoneNumber(profileId, phoneNumber);
            res.status(200).json({ success: true, data: updatedProfile, message: "Phone number added successfully." });
        } catch (error) {
            res.status(500).json({ success: false, error: {
                code: 'SERVER_ERROR',
                message: error.message
               } });
        }
    }

    async addAddressInfo(req, res) {
        try {
            const { streetNumber, streetName, localGovtArea, state, zipCode, country } = req.body;
            const { profileId } = req.params;
            const updatedProfile = await profileService.addAddressInfo(profileId, streetNumber, streetName, localGovtArea, state, zipCode, country);
            res.status(200).json({ success: true, data: updatedProfile, message: "Address added successfully." });
        } catch (error) {
            res.status(500).json({ success: false, error: {
                code: 'SERVER_ERROR',
                message: error.message
               } });
        }
    }

    async updateTheme(req, res) {
        try {
            const { theme } = req.body;
            if (!theme || theme !== "light" || theme !== "dark") {
                res.status(400).json({ success: false, message: 'Invalid theme' });
                return;
            }
            const { profileId } = req.params;
            const updatedProfile = await profileService.updateTheme(profileId, theme);
            res.status(200).json({ success: true, data: updatedProfile, message: "Theme updated successfully." });
        } catch (error) {
            res.status(500).json({ success: false, error: {
                code: 'SERVER_ERROR',
                message: error.message
               } });
        }
    }

    async addBio(req, res) {
        try {
            const { bio } = req.body;
            const { profileId } = req.params;
            const updatedProfile = await profileService.addBio(profileId, bio);
            res.status(200).json({ success: true, data: updatedProfile, message: "Bio added successfully." });
        } catch (error) {
            res.status(500).json({ success: false, error: {
                code: 'SERVER_ERROR',
                message: error.message
               } });
        }
    }

    async addProfilePic(req, res) {
        try {
            const { profileId } = req.params;
            let profileUrl;

            const imageFile = req.file;

            if (!imageFile) {
                return res.status(400).json({ success: false, message: 'No image file provided' });
              }
                try {
                  const result = await cloudinary.uploader.upload(imageFile.path, {
                    folder: cloudinaryFolder,
                    use_filename: true,
                    unique_filename: false,
                    resource_type: 'auto',
                  });
                  profileUrl = result.secure_url;
                } catch (error) {
                    logger.error(error);
                  return res.status(500).json({ success: false, error: {
                    code: 'IMAGE_UPLOAD_FAILED',
                    message: "Image failed to upload. Please check the logs for more information."
                   } });
                }

            const updatedProfile = await profileService.addProfilePic(profileId, profileUrl);
            res.status(200).json({ success: true, data: updatedProfile, message: "Profile picture added successfully." });
        } catch (error) {
            res.status(500).json({ success: false, error: {
                code: 'SERVER_ERROR',
                message: error.message
               } });
        }
    }

    async getProfileById(req, res) {
        try {
            const { userId } = req.params;
            const profile = await profileService.getProfileByUserId(userId);
            res.status(200).json({ success: true, data: profile });
        } catch (error) {
            res.status(500).json({ success: false, error: {
                code: 'SERVER_ERROR',
                message: error.message
               }
            });
        }
    }
}

module.exports = ProfileController