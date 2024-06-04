const asyncHandler = require("express-async-handler");
const CartModel = require("./CartModel");
const { calculateTotal } = require("../../utils/CartUtils");
const { log } = require("winston");
const ProductModel = require("../products/ProductModel");


const addToCart = asyncHandler (async(req,res) => {
    const {productId} = req.body;
    const isSeller = await ProductModel.findOne({_id:productId});
    if(isSeller.user.toString() == req.user._id) return res.status(403).json({msg: "You cannot buy your product"});
    const cart = await CartModel.findOne({user:req.user._id});
    // user has no cart
    const {price,discount} = isSeller;
    if(!cart){
        const cartItem = await CartModel.create({user:req.user._id,items:[{productId}],discount,orderValue:price});
        return res.status(201).json({success: true, data:cartItem, message:"Item added to cart successfully"})
    }
    // user has cart
    const itemInCart = cart.items.filter(item => item.productId == productId);
    // the product is not in cart
    if(itemInCart.length){
        return res.status(400).json({success: false, data:null, message:"Item aleady in cart"})
    }
    cart.items.push({productId,quantity:1});
    cart.orderValue = price;
    cart.discount = discount;
    // cart.total = discountPrice;
    await cart.save()
    return res.status(201).json({success: true, data:cart, message:"Item added to cart successfully"})
})

const getCart = asyncHandler(async(req,res) => {
    const {cartId} = req.body;
    const cart = await CartModel.findById({_id:cartId}).populate('items.productId');
    console.log(cart);
    const orderValue = calculateTotal(cart.items);
    const total = orderValue;
    cart.orderValue = orderValue;
    cart.total = total;
    await cart.save();
    return res.status(200).json({cart})
})

const increaseCartItem = asyncHandler (async (req,res) => {
    const {productId} = req.body;
    // find product and check for quantity
    let cart = await CartModel.findOne({user:req.user._id}).populate("items");
    cart = await ProductModel.populate(cart,{path: "items.productId",select:"price discountPrice discount"});
    let indexItem = 0;
    const itemInCart = cart.items.filter((item,index) => {
        indexItem = index;
        return item.productId._id == productId
    });
    if(itemInCart.length){
        const {price,discount,id} = itemInCart[0].productId;
        itemInCart[0].quantity++;
        cart.items[indexItem].productId = id;
        cart.orderValue = price * itemInCart[0].quantity;
        // calculate discount
        cart.totalDiscount = discount;
        // cart.total = discountPrice * itemInCart[0].quantity;
        await cart.save();
    }
    return res.status(201).json({success:true,data:cart,message:"Cart updated successfully"});
})


const decreaseCartItem = asyncHandler (async (req,res) => {
    const {productId} = req.body;
    // find product and check for quantity
    let cart = await CartModel.findOne({user:req.user._id}).populate("items");
    cart = await ProductModel.populate(cart,{path: "items.productId",select:"price discountPrice discount"});
    let indexItem = 0;
    const itemInCart = cartItem.items.filter((item,index) => {
        indexItem = index
        return item.productId.id == productId
    });
    const {price,discount} = itemInCart[0].book;
    if(itemInCart[0].quantity >= 1){
        itemInCart[0].quantity--;
    }
    if(itemInCart[0].quantity < 1){
        await cartItem.deleteOne();
        return res.status(201).json({success:true,message:"Cart updated Successfully", data:[]})
    }
    cart.orderValue -= price ;
    // // calculate discount
    cart.totalDiscount = discount;
    // cart.total -= discountPrice;
    await cart.save();
    return res.status(200).json({success:true,message:"Cart updated Successfully", data:cart});
})


const clearCart = asyncHandler (async (req,res) => {
    // req.user = "65ef95058b2bf77e420c1308"
    const {cartId} = req.body;
    await CartModel.findOneAndDelete({_id:cartId,user:req.user});
    return res.status(201).json({msg:"cart deleted"})
})

module.exports = {addToCart,increaseCartItem,decreaseCartItem,clearCart,getCart}