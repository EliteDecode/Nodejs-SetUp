class CartService {

    async createCart (req) {
        const {productId} = req.body;
        const cart = await CartModel.findOne({user:req.user}).populate("items.productId");
        // user has no cart
        if(!cart){
            const cartItem = await CartModel.create({user:req.user,items:[{productId,quantity:1}]});
            // console.log(cartItem);
            const total = orderValue;
            cartItem.orderValue = orderValue;
            cartItem.total = total;
            return cartItem;
        }
        // user has cart
        const itemInCart = cart.items.find(item => item.productId.toString() == productId);
        if(itemInCart){
            return false;
        }
        cart.items.push({productId,quantity:1});
        const total = orderValue;
        cart.orderValue = orderValue;
        cart.total = total;
        await cart.save()
        return cart;
    }

    async getCart (req) {
        const {cartId} = req.body;
        const cart = await CartModel.findById({_id:cartId}).populate('items.productId');
        console.log(cart);
        return cart;
        // return res.status(200).json({cart})
    }

    async increaseCart (req,res) {
        const {productId} = req.body;
        // find product and check for quantity
        const cartItem = await CartModel.findOne({user:req.user});
        const itemInCart = cartItem.items.filter(item => item.productId == productId);
        itemInCart[0].quantity++
        const itmems = cartItem.items.map(item => item.productId == productId ? itemInCart[0] : cart);
        console.log(itmems);
        // const orderValue = cartItem.orderValue + itemInCart.productId.price;
        // cartItem.orderValue = orderValue;
        // await cartItem.save();
        // const orderValue = calculateTotal(cart.items);
        // cart.orderValue = orderValue;
        return res.status(201).json({msg:"here"});
    }

    async deleteCart (req,res) {
        const {productId} = req.body;
        // find product and check for quantity
        const cartItem = await CartModel.findOneAndUpdate({user:req.user});
        let indexItem = 0;
        const itemInCart = cartItem.items.filter((item,index) => {
            indexItem = index
            return item.productId == productId
        });
        if(itemInCart[0]?.quantity > 1){
            itemInCart[0].quantity--
            await cartItem.save();
            return res.status(201).json({msg:"here 00"})
        }
        if(cartItem.items.length > 1){
            cartItem.items.splice(indexItem,1)
            await cartItem.save();
            return res.status(201).json({msg:"here what"})
        }
        await cartItem.deleteOne();
        return res.status(200).json({msg:"item removed"})
    }

    async clearCart (req,res) {
        const {cartId} = req.body;
        await CartModel.findOneAndDelete({_id:cartId,user:req.user});
        return true;
    }
}

module.exports = CartService;



// const increaseCartItem = asyncHandler (async (req,res) => {
//     const {productId} = req.body;
//     // find product and check for quantity
//     const cartItem = await CartModel.findOne({user:req.user});
//     const itemInCart = cartItem.items.filter(item => item.productId == productId);
//     itemInCart[0].quantity++
//     const itmems = cartItem.items.map(item => item.productId == productId ? itemInCart[0] : cart);
//     console.log(itmems);
//     // const orderValue = cartItem.orderValue + itemInCart.productId.price;
//     // cartItem.orderValue = orderValue;
//     // await cartItem.save();
//     // const orderValue = calculateTotal(cart.items);
//     // cart.orderValue = orderValue;
//     return res.status(201).json({msg:"here"});
// })


// const decreaseCartItem = asyncHandler (async (req,res) => {
//     const {productId} = req.body;
//     // find product and check for quantity
//     const cartItem = await CartModel.findOneAndUpdate({user:req.user});
//     let indexItem = 0;
//     const itemInCart = cartItem.items.filter((item,index) => {
//         indexItem = index
//         return item.productId == productId
//     });
//     if(itemInCart[0]?.quantity > 1){
//         itemInCart[0].quantity--
//         await cartItem.save();
//         return res.status(201).json({msg:"here 00"})
//     }
//     if(cartItem.items.length > 1){
//         cartItem.items.splice(indexItem,1)
//         await cartItem.save();
//         return res.status(201).json({msg:"here what"})
//     }
//     await cartItem.deleteOne();
//     return res.status(200).json({msg:"item removed"})
// })
