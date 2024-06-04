const mongoose = require("mongoose");

const SellerSchema = mongoose.Schema({
    businessName: {
        type: String
    },
    businessRegNo:{
        type: Number
    },
    address:{
        type:{
            country: String,
            zipCode: Number,
            address1: String,
            address2:String,
            city: String
        },
        default:{
            country: '',
            zipCode: '',
            address1: '',
            address2: '',
            city: ''
        }
    },
    code:{
        type: String
    },
    isVerified:{
        type:Boolean
    }
},{timestamps: true})

const SellerModel = mongoose.model("Seller", SellerSchema);
module.exports = SellerModel;