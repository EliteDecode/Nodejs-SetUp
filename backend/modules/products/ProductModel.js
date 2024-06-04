const mongoose = require("mongoose");
// // require("./reviewModel")

const ProductSchema = mongoose.Schema({
    name: String,
    price: String,
    desc: String,
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    image: [{
        publicId: String,
        secureUrl: String,
        path:String
    }],
    category: {
        type: String,
        default: "fashion",
        enum: ["phones and tablets","home appliances","office Appliances", "fashion","computer", "electronics,food"]
    },
    subCategories: {
        type: [String],
        default: "Women Clothing"
    },
    tags: {
        type: [String],
        default: "Crop Tops"
    },
    brands: [String],
    freeDelivery: {
        type: Boolean,
        default: false
    },
    discount: {
        type: Number,
        default: 0
    },
    averageRating:{
        type: Number,
        min: 1,
        max: 5
    },
    numberOfReviews:{
        type:Number,
        default: 0
    }
},{timestamps:true, toJSON: { virtuals: true }, toObject: { virtuals: true }})

ProductSchema.virtual("reviews",{
    ref: 'Review',
    localField: '_id',
    foreignField: 'productId',
    justOne:false
})

ProductSchema.pre("remove", async function() {
    await this.model('Review').deleteMany({ product: this._id });
})

module.exports = mongoose.model("Product",ProductSchema);

