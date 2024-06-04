const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
    cartId:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered'],
        default: 'pending'
    }
},
 { timestamps: true}
);


const Order = mongoose.model("Order", OrderSchema)

module.exports = Order
