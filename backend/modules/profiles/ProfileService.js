const ProfileRepository = require('./ProfileRepository');
const crypto = require('crypto');
const logger = require("../../utils/logging")

const profileRepo = new ProfileRepository();

class ProfileService {
    async addCardInfo(profileId, cardNumber, cardName, expiryDate) {
        try {
            const ecn = crypto.createCipher('aes-256-cbc', process.env.CARD_INFO_ENCRYPTION_KEY);

            cardNumber = ecn.update(cardNumber, 'utf8', 'hex');
            cardName = ecn.update(cardName, 'utf8', 'hex');
            expiryDate = ecn.update(expiryDate, 'utf8', 'hex') + ecn.final('hex');

            const cardInfo = {
                cardNumber,
                cardName,
                expiryDate,
            };
            const updatedProfile = await profileRepo.addCardInfo(profileId, cardInfo);
            return updatedProfile;
        } catch (error) {
            logger.error(error.message, {module: "Profile", action: "addCardInfo", error});
            throw error;
        }
    }

    async addPhoneNumber(userId, phoneNumber) {
        try {
            const phoneNumberFormatted = phoneNumber.startsWith('+234')
                ?  phoneNumber
                : phoneNumber.startsWith('0')
                    ? `+234${phoneNumber.slice(1)}`
                    : '+234'+phoneNumber;
            const updatedProfile = await profileRepo.addPhoneNumber(userId, phoneNumberFormatted);
            return updatedProfile;
        } catch (error) {
            logger.error(error.message, {module: "Profile", action: "addPhoneNumber", error});
            throw error;
        }
    }

    async addAddressInfo(profileId, streetNumber, streetName, localGovtArea, state, zipCode, country) {
        try {
            const addressInfo = {
                streetNumber,
                streetName,
                localGovtArea,
                state,
                zipCode,
                country
            };
            const updatedProfile = await profileRepo.addAddressInfo(profileId, addressInfo);
            return updatedProfile;
        } catch (error) {
            logger.error(error.message, {module: "Profile", action: "addAddressInfo", error});
            throw error;
        }
    }

    async createProfile(userId) {
        try {
            const newProfile = await profileRepo.initProfile(userId);
            return newProfile;
        } catch (error) {
            logger.error(error.message, {module: "Profile", action: "createProfile", error});
            throw error;
        }
    }

    async addProfilePic(profileId, profilePic) {
        try {
            const updatedProfile = await profileRepo.addProfilePic(profileId, profilePic);
            return updatedProfile;
        } catch (error) {
            logger.error(error.message, {module: "Profile", action: "addProfilePic", error});
            throw error;
        }
    }

    async addBio(profileId, bio) {
        try {
            const updatedProfile = await profileRepo.addBio(profileId, bio);
            return updatedProfile;
        } catch (error) {
            logger.error(error.message, {module: "Profile", action: "addBio", error});
            throw error;
        }
    }

    async getProfileByUserId(userId) {
        try {
            const profile = await profileRepo.getProfileByUserId(userId);
            return profile;
        } catch (error) {
            logger.error(error.message, {module: "Profile", action: "getProfileByUserId", error});
            throw error;
        }
    }

    async updateTheme(profileId, theme) {
        try {
            const updatedProfile = await profileRepo.updateTheme(profileId, theme);
            return updatedProfile;
        } catch (error) {
            logger.error(error.message, {module: "Profile", action: "updateTheme", error});
            throw error;
        }
    }
}

module.exports = ProfileService