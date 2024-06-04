const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
    addressInfo: {
        type: {
            streetNumber: String,
            streetName: String,
            localGovtArea: String,
            state: String,
            zipCode: String,
            country: String
        },
        default: {
            streetNumber: "",
            streetName: "",
            localGovtArea: "",
            state: "",
            zipCode: "",
            country: ""
        }
    },
    theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light"
    },
    bio: {
        type: String,
        default: ""
    },
    profilePic: {
        type: String,
        default: ""
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    cardInfo: {
        type: {
            cardNumber: String,
            cardName: String,
            expiryDate: String,
        },
        default: {
            cardNumber: "",
            cardName: "",
            expiryDate: "",
        }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "User"
    },

}, {
    timestamps: true
});

module.exports = mongoose.model("Profile", profileSchema)