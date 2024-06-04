const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");
const ProductService = require("./ProductService");
const cloudinary = require("cloudinary").v2;
const fs = require("fs/promises");
const ProductModel = require("./ProductModel");

const productService = new ProductService()

// POST PRODUCT
const createProduct = asyncHandler( async (req,res) => {
    // check if user is a seller
    const {name, description, price } = req.body;
    if(!name || !description || !price){
        return res.status(400).json({success: false,
            error: {
                code: 'BAD_REQUEST',
                message: "Provide all fields"
            }
        });
    }
    if (!req?.files || req.files.length === 0 || req.files.length > 4) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'BAD_REQUEST',
                message: "Provide at most four images"
            }
        });
    }
    const notAnImage = req.files.filter(img => !img.mimetype.includes('image'));
    if(notAnImage.length >= 1){
        // req.files.map( async img => await fs.unlink(img.path))
        return res.status(400).json({
            success: false,
            error: {
                code: 'BAD_REQUEST',
                message: "Provide only images"
            }
        });
    }

    try {
        const imageUploadPromises = req.files.map(async img => {
            const cloudImage = await cloudinary.uploader.upload(img.path, {
                folder: process.env.CLD_FOLDER_PRODUCT
            });
            return { publicId: cloudImage.public_id, secureUrl: cloudImage.secure_url };
        });
        const uploadedImages = await Promise.all(imageUploadPromises);
        const newProduct = {...req.body,user:req.user._id,image:uploadedImages};
        const product = await productService.createProduct(newProduct);
        if(!product){
            return res.status(500).json({
                success: false,
                error: {
                    code: 'SERVER_ERROR',
                    message: "Error creating product"
                }
            });
        }
        return res.status(201).json({ success: true, data: product, message: "Product Created Successfully." });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Error adding product.'
            }
        });
    }
});


const getAllProducts = asyncHandler( async (req,res) => {
    const {category, tags,search,subCategory} = req.query;
    console.log(category,tags);
    // Filtering here
    const query = {}
    if(search){
        query.$or = [
            {name : {$regex :search, $options: "i"}}
        ]
    }
    if(category){
        query.category = category.toLowerCase();
    }
    if(subCategory){
        query.subCategory = subCategory.toLowerCase();
    }
    const products = await productService.getAllProducts(query);
    if(!products){
        return res.status(500).json({
            success: false,
            error: {
                code: 'BAD_REQUEST',
                message: "Error getting all product"
            }
        });
    }
    return res.status(200).json({ success: true, data: products, message: "Product list Sent Successfully." })
})


const getProduct = asyncHandler( async (req,res) => {
    const {id} = req.params;
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if(!id || !isValid){
        return res.status(400).json({
            success: false,
            error: {
                code: 'BAD_REQUEST',
                message: "provide valid product-id"
            }
        });
    }
    const product = await productService.getProductById(id)
    if(!product){
        return res.status(404).json({
            success: false,
            error: {
                code: 'NOT_FOUND',
                message: `Error getting product with id - ${id}`
            }
        });
    }
    return res.status(200).json({ success: true, data: product, message: "Product Sent Successfully." })
})


const getProductOfSeller = asyncHandler(async (req,res) => {
    const products = await ProductModel.find({user:req.params.id});
    return res.status(200).json({success:true,message:"Products sent",data:products});
})


const updateProduct = asyncHandler ( async (req,res) => {
    const {id} = req.params;
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if(!id || !isValid){
        res.status(400);
        throw new Error("provide valid product-id")
    }
    const {name, description, price } = req.body;
    if(!name || !description || !price){
        req.files.map( async img => await fs.unlink(img.path))
        return res.status(400).json({success: false,
            error: {
                code: 'BAD_REQUEST',
                message: "Provide all fields"
            }
        });
    }
    if (!req?.files || req.files.length === 0 || req.files.length > 4) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'BAD_REQUEST',
                message: "Provide four image"
            }
        });
    }
    const notAnImage = req.files.filter(img => !img.mimetype.includes('image'));
    if(notAnImage.length >= 1){
        req.files.map( async img => await fs.unlink(img.path))
        return res.status(400).json({
            success: false,
            error: {
                code: 'BAD_REQUEST',
                message: "Provide only images"
            }
        });
    }
    if(req.files.length){
        console.log("here0000");
        try {
            const product = await ProductModel.findOne({_id:id,userId : req.user.userId});
            console.log("here",product);
            const deleteFromCloud = product.image.map(async img => {
                console.log(img);
                await cloudinary.uploader.destroy(img.publicId);
            });
            await Promise.all(deleteFromCloud);
            console.log("here");
            const imageUploadPromises = req.files.map(async img => {
                console.log(img);
                const cloudImage = await cloudinary.uploader.upload(img.path, {
                    folder: process.env.CLD_FOLDER_PRODUCT
                });
                await fs.unlink(img.path)
                return { publicId: cloudImage.public_id, secureUrl: cloudImage.secure_url };
            });
            const uploadedImages = await Promise.all(imageUploadPromises);
            const newProduct = {...req.body,image:uploadedImages};
            const updatedProduct = await ProductModel.findByIdAndUpdate({_id:id,userId : req.user},newProduct,{new:true});
            return res.status(200).json({msg:"success",product: updatedProduct})
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: {
                    code: 'SERVER_ERROR',
                    message: `Error updating product with id - ${id}`
                }
            });
        }
    }
});


const deleteProduct = asyncHandler( async (req,res) => {
    const {id} = req.params;
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if(!id || !isValid){
        res.status(404);
        throw new Error("No such product")
    }
    const product = await ProductModel.findOne({_id:id,user : req.user});
    if(!product){
        return res.status(404).json({
            success: false,
            error: {
                code: 'NOT_FOUND',
                message: `Error getting product with id - ${id}`
            }
        });
    }
    try {
        const deleteFromCloud = product.image.map(async img => {
            await cloudinary.uploader.destroy(img.publicId);
        });
        await Promise.all(deleteFromCloud);
        await product.deleteOne();
        return res.status(200).json({msg:"deleted successfully"})
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Error deleting image.'
            }
        });
    }
})


module.exports = {createProduct,getAllProducts,getProduct,updateProduct,deleteProduct,getProductOfSeller}