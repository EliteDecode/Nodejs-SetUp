const WishlistService = require("./WishlistService")

const wishlistService = new WishlistService()

class WishlistController {

    async addToWishlist (req,res) {
        // check to see if the productId is of mongoose type and it is present
        const wishlist = wishlistService.addToWishlist(req);
        return res.status(200).json({success:true,message:"Item added to wishlist"});
    }

    async removeFromWishlist(req,res){
        const wishlist = wishlistService.removeFromWishlist(req);
        return res.status(200).json({success:true,message:"Item removed",data:wishlist});
    }

    async getUserWishlist () {
        const wishlist = WishlistModel.getUserWishlist(req);
        return res.status(200).json({success:true,message:"Item sent successfully",data:wishlist});
    }


}

module.exports = WishlistController;