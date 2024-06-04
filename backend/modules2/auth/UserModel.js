const mongoose = require("mongoose");


const UserSchema = mongoose.Schema({

    fullname: {
        type: String
    },
    email:{
        type: String
    },
    password:{
        type: String
    },
    verifyOtp:{
        type: Number
    },
    forgotPasswordOtp:{
        type: Number
    },
    businessCode:{
        type: Number
    },
    sellerId:{
        type: mongoose.Types.ObjectId,
        ref: "Seller",
        default: null
    },
    profileId:{
        type: mongoose.Types.ObjectId,
        ref: "Profile",
        default: null
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    role:{
        type: String,
        default: "user",
        enum: ["admin","user","seller"]
    }

},{timestamps:true});

const UserModel = mongoose.model("User",UserSchema);

module.exports = UserModel;