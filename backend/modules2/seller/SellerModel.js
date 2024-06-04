const mongoose = require("mongoose");

const SellerSchema = mongoose.Schema({
    businessName: {
        type: String,
        required: true
    },
    businessRegistrationNumber:{
        type: Number,
        required: true
    },
    businessAddress:{
        type:{
            country: String,
            state: String,
            zipCode: Number,
            addressOne: String,
            addressTwo: String
        },
        default:{
            country: null,
            state:null,
            zipCode: null,
            addressOne: null,
            addressTwo:null
        }
    },
    billingAccount:{
        type: Number
    },
    status: {
        type: String,
        enum: ["verified","pending","not-verified"],
        default: "not-verified"
    },
    verificationIdentity:{
        type: String,
        enum: ["NIN"]
    },
    verificationFile: {
        type: {
            publicUrl : String,
            secureUrl: String
        }
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true});

const SellerModel = mongoose.model("Seller", SellerSchema);

module.exports = SellerModel;