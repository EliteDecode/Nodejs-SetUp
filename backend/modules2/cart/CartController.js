const CartService = require("./CartService");

const cartService = new CartService()

class CartController {

    async createCart (req,res) {
        const cart = await cartService.createCart(req);
        if(!cart) return res.status(400).json({success:false,message:"Item already in cart"})
        return res.status(201).json({success:true,message:"item added to cart",data:cart})
    }

    async getCart (req,res) {

    }

    async increaseCart (req,res) {

    }

    async deleteCart (req,res) {

    }

    async clearCart (req,res) {
        const cart = await cartService.clearCart(req);
        return res.status(201).json({msg:"cart deleted"});
    }
}


module.exports = CartController;