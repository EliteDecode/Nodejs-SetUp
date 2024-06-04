const DonationService = require("./DonationService");
const cloudinary = require('cloudinary').v2;
const cloudinaryFolder = process.env.CLD_FOLDER_TWO || "";


class DonationCampaignController {
  constructor() {
    this.donationService = new DonationService();
  }

  async createDonationCampaign(req, res) {
    if (!req.files || !req.body) {
      return res.status(400).json({ success: false, error: {code: 'BAD_REQUEST',message:'Missing data'} });
    }

    try {
      const imageFiles = req.files;
      const banners = [];

      for (const file of imageFiles) {
        if (!file || !file.path) {
          throw new Error(`Image file is missing or has null path: ${file}`);
        }

        const result = await cloudinary.uploader.upload(file.path, {
          folder: cloudinaryFolder,
          use_filename: true,
          unique_filename: false,
          resource_type: 'auto',
        });

        if (!result || !result.secure_url) {
            logger.error("Problem uploading file", {module: "Donation", action: "createDonationCampaign", result});
            throw new Error(`Cloudinary upload failed: ${result}`);
        }

        banners.push(result.secure_url);
      }

      const { title, target, description, tags, startDate, endDate, goals } = req.body;

      if (!title || !target || !description || !startDate || !endDate || !tags) {
        throw new Error('Required data is missing');
      }

      const newCampaign = await this.donationService.addNewDonationCampaign(title, target, description, startDate, endDate, tags, goals, banners);
      res.status(200).json({
        success: true,
        data: newCampaign,
        message: 'Campaign created successfully'
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({ success: false, error: {
        code: 'SERVER_ERROR',
        message: err.message
      } });
    }
  }

  async getDonationCampaigns(req, res) {
    try {
      const campaigns = await this.donationService.getDonationCampaigns();
      res.status(200).json({message: "Campaigns retrieved successfully", data: campaigns, success: true});
    } catch (error) {
      res.status(500).json({ success: false, error: {
        code: 'SERVER_ERROR',
        message: err.message
      } });
    }
  }

  async getDonationCampaignById(req, res) {
    const id = req.params.id;

    try {
      const campaign = await this.donationService.getDonationCampaignById(id);
      if (campaign) {
        res.status(200).json({message: "Campaign retrieved successfully", data: campaign, success: true});
      } else {
        res.status(404).json({ success: false, error: {
            code: 'NOT_FOUND', message: "Campaign not found" }});
      }
    } catch (error) {
      res.status(500).json({ success: false, error: {
        code: 'SERVER_ERROR',
        message: err.message
      } });
    }
  }

  async getDonationCampaignsByTag(req, res) {
    const tag = req.body.tag;

    try {
      const campaigns = await this.donationService.getDonationCampaignsByTag(tag);
      res.status(200).json({message: "Campaigns retrieved successfully", data: campaigns, success: true});
    } catch (error) {
      res.status(500).json({ success: false, error: {
        code: 'SERVER_ERROR',
        message: err.message
      } });
    }
  }

  async updateDonationCampaign(req, res) {
    const id = req.params.id;
    const campaign = req.body;

    try {
      const updatedCampaign = await this.donationService.updateDonationCampaign(id, campaign);
      if (updatedCampaign) {
        res.status(200).json({message: "Campaign updated successfully", data: updatedCampaign, success: true});
      } else {
        res.status(404).json({  success: false, error: { code: 'NOT_FOUND', message: "Campaign not found" } });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: {
        code: 'SERVER_ERROR',
        message: err.message
      } });
    }
  }

  async deleteDonationCampaign(req, res) {
    const id = req.params.id;

    try {
      await this.donationService.deleteDonationCampaign(id);
      res.status(200).json({ success: true,  message: "Campaign deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, error: {
        code: 'SERVER_ERROR',
        message: err.message
      } });
    }
  }
}

module.exports = DonationCampaignController;
