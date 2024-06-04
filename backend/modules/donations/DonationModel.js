const mongoose = require("mongoose")

const DonationCampaignSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    target: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    duration: {
        type: {
            startDate: {
                type: Date,
                required: true
            },
            endDate: {
                type: Date,
                required: true
            }
        },
        required: true
    },
    tags: {
        type: [String],
        required: true,
        enum: ["Education", "Poverty Alleviation", "Technology", "Startup Funding", "Health", "Environment", "Water", "Livelihoods", "Safety"]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    banners: {
        type: [String],
        required: true,
    },
    goals: {
        type: [String]
    }
})

const DonationCampaign = mongoose.model('DonationCampaign', DonationCampaignSchema);

module.exports = DonationCampaign;
