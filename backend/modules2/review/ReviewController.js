const asyncHandler = require("express-async-handler");
const ReviewModel = require("./ReviewModel");
const ProductModel = require("../product/ProductModel");

class ReviewController {

    async postReview (req,res) {
        const {review,rating,productId} = req.body;
        if(!review || !rating || !productId){
            return res.status(400).json({msg:"Provide all fields"})
        }
        const productExist = await ProductModel.findById({_id:productId});
        if(!productExist) return res.status(400).json({success:false,message: "No Such Product"});
        if(productExist.seller == req.user.userId) return res.status(403).json({success:false,message: "You cannot review your product"});
        const userAlreadyReviewedProduct = await ReviewModel.findOne({productId,userId:req.user.userId})
        if(userAlreadyReviewedProduct){
            return res.status(400).json({msg: "You have already reviewed this product"})
        };
        const data = await ReviewModel.create({userId:req.user.userId,...req.body});
        return res.status(201).json({data})
    }

    // async getAllProductReview(req,res) {
    //     const reviews = await ReviewModel.find({});
    //     return res.status(200).json({reviews})
    // }

}


module.exports = ReviewController;


// const getReview = asyncHandler (async (req,res) => {
//     const {reviewId} = req.params;
//     const validId = mongoose.Types.ObjectId(reviewId);
//     if(!validId){
//         return res.status(404).json({msg:`No review with this id - ${reviewId}`})
//     }

//     const review = await ReviewModel.findOne({_id:reviewId})
//     return res.status(200).json({review})
// })


// const updateReview = asyncHandler (async (req,res) => {
//     const {review,rating,productId} = req.body;
//     if(!review || !rating || !productId){
//         return res.status(400).json({msg:"Provide all fields"})
//     }

//     const updateReview =  await ReviewModel.findOneAndUpdate({userId:req.user,productId},{res,rating},{new:true});
//     return res.status(200).json({msg:updateReview})
// })

// const deleteReview = asyncHandler( async (req,res) => {
//     const updateReview =  await ReviewModel.findOneAndUpdate({userId:req.user,productId},{res,rating},{new:true});
//     return res.status(200).json({msg:"Review Deleted"})
// })