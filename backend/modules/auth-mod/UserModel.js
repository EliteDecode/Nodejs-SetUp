const mongoose = require("mongoose");

usersSchema = mongoose.Schema(
  {
    Firstname: {
      type: String,
      required: [true, "Please provide your firstname"],
    },
    Lastname: {
      type: String,
      required: [true, "Please provide your surname"],
    },
    Email: {
      type: String,
      unique: true,
      rquired: [true, "Please provide your email"],
    },
    Password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBlacklisted: {
      type: Boolean,
      default: false,
    },
    Token: {
      type: Number,
    },
    VerifyEmailCode:{
      type : Number
    },
    ForgotPasswordCode:{
      type : Number
    },
    Verified: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", usersSchema);

const refreshTokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

module.exports = { User, RefreshToken };