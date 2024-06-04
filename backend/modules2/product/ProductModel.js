const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    name: String,
    price: String,
    desc: String,
    seller: {
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
        enum: ["phones and tablets","home appliances","affice Appliances", "fashion","computer", "electronics"]
    },
    subCategories: {
        type: [String],
        default: "Women Clothing"
    },
    stocks:{
        type: Number
    },
    sold:{
        type: Number,
        default: 0
    },
    tags: {
        type: String
    },
    brands: [String],
    averageRating: Number,
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

