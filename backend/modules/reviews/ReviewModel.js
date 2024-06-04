const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product"
    },
    review: {
        type: String,
        required: true
    },
    rating:{
        type: Number,
        min: 1,
        max:5
    }
},{
    timestamps:true,
    toJSON:true,
    toOject: true
})


ReviewSchema.index({ productId: 1, reviewer: 1 }, { unique: true });
ReviewSchema.index({ productId: 1 });

ReviewSchema.statics.averageRating = async function (productId) {
    const result = await this.aggregate([
      { $match: { productId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          numberOfReviews: { $sum: 1 },
        },
      },
    ]);
  console.log(result);
    try {
      await this.model('Product').findOneAndUpdate(
        { _id: productId },
        {
          averageRating: Math.ceil(result[0]?.averageRating || 0),
          numberOfReviews: result[0]?.numberOfReviews || 0,
        }
      );
    } catch (error) {
      throw new Error("Internal Server Error");
    }
};
  
ReviewSchema.post('save', async function () {
    await this.constructor.averageRating(this.productId);
});
  
ReviewSchema.post('remove', async function () {
    await this.constructor.averageRating(this.productId);
});

module.exports = mongoose.model("Review",ReviewSchema);