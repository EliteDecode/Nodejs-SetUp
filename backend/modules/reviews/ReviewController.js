const asyncHandler = require("express-async-handler");
const ReviewModel = require("./ReviewModel");
const { default: mongoose } = require("mongoose");
const ProductModel = require("../products/ProductModel");

const postReview = asyncHandler (async (req,res) => {
    const {review,rating,productId} = req.body;
    if(!review || !rating || !productId){
        return res.status(400).json({msg:"Provide all fields"})
    }
    const product = await ProductModel.findOne({_id:productId});
    if(!product){
        return res.status(400).json({success:false,message:"The requested product does not exist"})
    }
    if(product.user.toString() == req.user._id) return res.status(403).json({msg: "You cannot review your product"});
    const userAlreadyReviewedProduct = await ReviewModel.findOne({productId,user:req.user._id});
    if(userAlreadyReviewedProduct){
        return res.status(400).json({msg: "You have already reviewed this product"})
    };
    const data = await ReviewModel.create({userId:req.user,...req.body});
    return res.status(201).json({data:"jj"})
});


const getAllReview = asyncHandler (async (req,res) => {
    // admin route
    const reviews = await ReviewModel.find({});
    return res.status(200).json({reviews})
})


const getReview = asyncHandler (async (req,res) => {
    const {reviewId} = req.params;
    const validId = mongoose.Types.ObjectId(reviewId);
    if(!validId){
        return res.status(404).json({msg:`No review with this id - ${reviewId}`})
    }

    const review = await ReviewModel.findOne({_id:reviewId})
    return res.status(200).json({review})
})


const updateReview = asyncHandler (async (req,res) => {
    const {review,rating,productId} = req.body;
    if(!review || !rating || !productId){
        return res.status(400).json({msg:"Provide all fields"})
    }

    const updateReview =  await ReviewModel.findOneAndUpdate({userId:req.user,productId},{res,rating},{new:true});
    return res.status(200).json({msg:updateReview})
})

const deleteReview = asyncHandler( async (req,res) => {
    const updateReview =  await ReviewModel.findOneAndUpdate({userId:req.user,productId},{res,rating},{new:true});
    return res.status(200).json({msg:"Review Deleted"})
})


module.exports = {postReview,getAllReview,getReview,updateReview,deleteReview}