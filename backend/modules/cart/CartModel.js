const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    items:{
        type :[{
        productId: {
            type: mongoose.Types.ObjectId,
            ref: "Product"
        },
        quantity: {
            type: Number,
            default: 1
        }
        }],
        required: true,
    },
    orderValue:{
        type: Number,
        default: 0
    },
    total:{
        type: Number,
        default: 0
    },
    discount:{
        type: Number,
        default: 0
    }
},{timestamps:true})

module.exports = mongoose.model("Cart",CartSchema);

