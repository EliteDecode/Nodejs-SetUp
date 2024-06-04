const { default: mongoose } = require("mongoose");

const WishlistSchema = mongoose.Schema({
    user: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId,
},{timeStamps:true});

const WishlistModel = mongoose.model("Wishlist",WishlistSchema);

module.exports = WishlistModel;