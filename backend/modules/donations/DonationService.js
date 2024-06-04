const DonationRepository = require("./DonationRepository");
const logger = require("../../utils/logging")

const donationRepo = new DonationRepository();

class DonationService {
    async addNewDonationCampaign(title, target, description, startDate, endDate, tags, goals = [], banners = []) {
        try {
            const campaign = {
                title,
                target,
                description,
                tags,
                duration: {
                    startDate,
                    endDate
                },
                goals,
                banners
            };
            const newCampaign = await donationRepo.addNewDonationCampaign(campaign);
            return newCampaign;
        } catch (error) {
            logger.error(error.message, {module: "Donation", action: "addNewDonationCampaign", error});
            throw error;
        }
    }

    async getDonationCampaigns() {
        try {
            const campaigns = await donationRepo.getActiveDonationCampaigns();
            return campaigns;
        } catch (error) {
            logger.error(error.message, {module: "Donation", action: "getDonationCampaigns", error});
            throw error;
        }
    }

    async getDonationCampaignById(id) {
        try {
            const campaign = await donationRepo.getDonationCampaignById(id);
            return campaign;
        } catch (error) {
            logger.error(error.message, {module: "Donation", action: "getDonationCampaignById", error});
            throw error;
        }
    }

    async getDonationCampaignsByTag(tag) {
        try {
            const campaigns = await donationRepo.getDonationCampaignByTag(tag);
            return campaigns;
        } catch (error) {
            logger.error(error.message, {module: "Donation", action: "getDonationCampaignsByTag", error});
            throw error;
        }
    }

    async updateDonationCampaign(id, campaign) {
        try {
            const updatedCampaign = await donationRepo.updateDonationCampaign(id, campaign);
            return updatedCampaign;
        } catch (error) {
            logger.error(error.message, {module: "Donation", action: "updateDonationCampaign", error});
            throw error;
        }
    }

    async deleteDonationCampaign(id) {
        try {
            const deletedCampaign = await donationRepo.deleteDonationCampaign(id);
            return deletedCampaign;
        } catch (error) {
            logger.error(error.message, {module: "Donation", action: "deleteDonationCampaign", error});
            throw error;
        }
    }
}

module.exports = DonationService;