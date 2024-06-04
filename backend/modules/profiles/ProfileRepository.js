const Profile = require('./ProfileModel');

class ProfileRepository {

    async initProfile(userId) {
        try {
            const newProfile = await Profile.create({ userId });
            return newProfile;
        } catch (error) {
            throw error;
        }
    }
    async getProfileByUserId(userId) {
        try {
            const profile = await Profile.findOne({ userId });
            return profile;
        } catch (error) {
            throw error;
        }
    }

    async addPhoneNumber(profileId, phoneNumber) {
        try {
            const profileExists = await Profile.findById(profileId);
            if (!profileExists) {
                throw new Error('Profile not found');
            }
            const profile = await Profile.findByIdAndUpdate(
                profileId,
                { phoneNumber },
                { new: true }
            );
            return profile;
        } catch(error) {
            throw error;
        }
    }

    async addCardInfo(profileId, cardInfo) {
        try {
            const profileExists = await Profile.findById(profileId);
            if (!profileExists) {
                throw new Error('Profile not found');
            }
            const updatedProfile = await Profile.findByIdAndUpdate(profileId, { cardInfo }, { new: true });
            return updatedProfile;
        } catch (error) {
            throw error;
        }
    }

    async addAddressInfo(profileId, addressInfo) {
        try {
            const profileExists = await Profile.findById(profileId);
            if (!profileExists) {
                throw new Error('Profile not found');
            }
            const updatedProfile = await Profile.findByIdAndUpdate(profileId, { addressInfo }, { new: true });
            return updatedProfile;
        } catch (error) {
            throw error;
        }
    }

    async addProfilePic(profileId, profilePic) {
        try {
            const profileExists = await Profile.findById(profileId);
            if (!profileExists) {
                throw new Error('Profile not found');
            }
            const updatedProfile = await Profile.findByIdAndUpdate(profileId, { profilePic }, { new: true });
            return updatedProfile;
        } catch (error) {
            throw error;
        }
    }

    async addBio(profileId, bio) {
        try {
            const profileExists = await Profile.findById(profileId);
            if (!profileExists) {
                throw new Error('Profile not found');
            }
            const updatedProfile = await Profile.findByIdAndUpdate(profileId, { bio }, { new: true });
            return updatedProfile;
        } catch (error) {
            throw error;
        }
    }

    async updateTheme(profileId, theme) {
        try {
            const profileExists = await Profile.findById(profileId);
            if (!profileExists) {
                throw new Error('Profile not found');
            }
            const updatedProfile = await Profile.findByIdAndUpdate(profileId, { theme }, { new: true });
            return updatedProfile;
        } catch (error) {
            throw error;
        }
    }

    async getProfileById(profileId) {
        try {
            const profile = await Profile.findById(profileId);
            return profile;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProfileRepository;