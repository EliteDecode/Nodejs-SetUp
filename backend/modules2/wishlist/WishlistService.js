const WishlistModel = require("./WishlistModel");

class WishlistService {

    async addToWishlist (req) {
        // check to see if the productId is of mongoose type and it is present
        const wishlist = WishlistModel.create({productId:req.body.productId,user:req.user.userId});
        return wishlist;
    }

    async removeFromWishlist(){
        const wishlist = WishlistModel.findOneAndDelete({productId:req.body.productId,user:req.user.userId});
        return wishlist;
    }

    async getUserWishlist () {
        const wishlist = WishlistModel.find({user:req.user.userId});
        return wishlist;
    }


}

module.exports = WishlistService;