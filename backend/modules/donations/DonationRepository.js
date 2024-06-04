const DonationCampaign = require("./DonationModel");

class DonationRepository {

    async addNewDonationCampaign (campaign) {
        try {
            const newCampaign = await DonationCampaign.create(campaign);
            return newCampaign;
        } catch (error) {
            throw error;
        }
    }

    async getActiveDonationCampaigns() {
        try {
            const campaigns = await DonationCampaign.find({ isActive: true });
            return campaigns;
        } catch (error) {
            throw error;
        }
    }

    async getDonationCampaignByTag(tag) {
        try {
            const campaigns = await DonationCampaign.find({ tags: { $in: [tag] } });
            return campaigns;
        } catch (error) {
            throw error;
        }
    }

    async getAllDonationCampaigns() {
        try {
            const campaigns = await DonationCampaign.find({});
            return campaigns;
        } catch (error) {
            throw error;
        }
    }

    async getDonationCampaignById(id) {
        try {
            const campaign = await DonationCampaign.findById(id);
            return campaign;
        } catch (error) {
            throw error;
        }
    }

    async updateDonationCampaign(id, campaign) {
        try {
            const updatedCampaign = await DonationCampaign.findByIdAndUpdate(id, campaign, { new: true });
            return updatedCampaign;
        } catch (error) {
            throw error;
        }
    }

    async deleteDonationCampaign(id) {
        try {
            const deletedCampaign = await DonationCampaign.findByIdAndDelete(id);
            return deletedCampaign;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = DonationRepository;