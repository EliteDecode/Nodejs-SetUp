const ProductModel = require("./ProductModel");
const cloudinary = require("cloudinary").v2;
const fs = require("fs/promises")
const UserModel = require("../auth/UserModel")

class ProductService {

    async createProduct (req,res){
        const {name, description, price } = req.body;
        if(!name || !description || !price){
            req.files.map( async img => await fs.unlink(img.path));
            res.status(400);
            throw new Error("Provide all fields")
        }

        if (!req?.files || req.files.length === 0) {
            req.files.map( async img => await fs.unlink(img.path));
            res.status(400);
            throw new Error("Provide all fields")
        }

        const notAnImage = req.files.filter(img => !img.mimetype.includes('image'));
        if(notAnImage.length >= 1){
            req.files.map( async img => await fs.unlink(img.path))
            res.status(400);
            throw new Error("Provide only images")
        }

        let uploadedImages;
        try {
            let imageUploadPromises = req.files.map(async img => {
                console.log(img);
                const cloudImage = await cloudinary.uploader.upload(img.path, {
                    folder: process.env.CLD_FOLDER_PRODUCT
                });
                await fs.unlink(img.path)
                return { publicId: cloudImage.public_id, secureUrl: cloudImage.secure_url };
            });
            uploadedImages = await Promise.all(imageUploadPromises);
        } catch (error) {
            console.log(error);
            res.status(402);
            throw new Error ("Error adding product.");
        }

        const newProduct = {...req.body,user:req.user,image:uploadedImages};
        const product = await ProductModel.create(newProduct);
        if(!product){
            res.status(400);
            throw new Error ("Error adding product");
        }
        return product;
    }


    async getAllProduct (req){
        const {category, tags,search,subCategory} = req.query;
        console.log(category,tags);
        // Filtering here
        const query = {}
        if(search){
            query.name = [
                {name : {$regex :search, $options: "i"}}
            ]
        }
        if(category){
            query.category = category.toLowerCase();
        }
        if(subCategory){
            query.subCategory = subCategory.toLowerCase();
        }
        const products = await ProductModel.find(query);
        return products;
    }


    async getProduct (_id){
        let product = await ProductModel.findById({_id}).populate("reviews");
        await UserModel.populate(product.reviews,{path: "reviewer", select: "email"});
        console.log(product);
        return product;
    }


    async getAllProductBySeller (req){
        if(req.user.role != "seller")return false
        const product = await ProductModel.findOne({seller:req.user.userId});
        return product;
    }


    // async updateProduct (req,res) {
    //     const {id} = req.params;
    //     const isValid = mongoose.Types.ObjectId.isValid(id);
    //     if(!id || !isValid){
    //         res.status(400);
    //         throw new Error("provide valid product-id")
    //     }
    //     const {name, description, price } = req.body;
    //     if(!name || !description || !price){
    //         req.files.map( async img => await fs.unlink(img.path))
    //         res.status(400);
    //         throw new Error("Provide all fields");
    //     }
    
    //     const notAnImage = req.files.filter(img => !img.mimetype.includes('image'));
    //     if(notAnImage.length >= 1){
    //         req.files.map( async img => await fs.unlink(img.path));
    //         res.status(400);
    //         throw new Error("Provide only images");
    //     }
    //     if(req?.files.length){
    //         try {
    //             const product = await ProductModel.findOne({_id:id,userId : req.user});
    //             const deleteFromCloud = product.image.map(async img => {
    //                 await cloudinary.uploader.destroy(img.publicId);
    //             });
    //             await Promise.all(deleteFromCloud);
    //             const imageUploadPromises = req.files.map(async img => {
    //                 console.log(img);
    //                 const cloudImage = await cloudinary.uploader.upload(img.path, {
    //                     folder: process.env.CLD_FOLDER_PRODUCT
    //                 });
    //                 await fs.unlink(img.path)
    //                 return { publicId: cloudImage.public_id, secureUrl: cloudImage.secure_url };
    //             });
    //             const uploadedImages = await Promise.all(imageUploadPromises);
    //             const newProduct = {...req.body,image:uploadedImages};
    //             const updatedProduct = await ProductModel.findByIdAndUpdate({_id:id,userId : req.user},newProduct,{new:true});
    //             return updatedProduct;
    //         } catch (error) {
    //             console.log(error);
    //             res.status(400);
    //             throw new Error ("Error updating product.");
    //         }
    //     }
    //     const updatedProduct = await ProductModel.findByIdAndUpdate({_id:id,userId : req.user},req.body,{new:true});
    //     if(!updatedProduct){
    //         res.status(400);
    //         throw new Error (`Error updating product with id - ${id}`);
    //     }
    //     return updatedProduct;
    // }


    async deleteProduct (req,res) {
        const {id} = req.params;
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!id || !isValid){
            res.status(404);
            throw new Error("No such product")
        }
        const product = await ProductModel.findOne({_id:id,user : req.user});
        if(!product){
            res.status(404);
            throw new Error ( `No product with id - ${id}`);
        }
        try {
            const deleteFromCloud = product.image.map(async img => {
                await cloudinary.uploader.destroy(img.publicId);
            });
            await Promise.all(deleteFromCloud);
            product.deleteOne();
            return true
        } catch (error) {
            console.log(error);
            res.status(400);
            throw new Error ("Error deleting product.");
        }
    }
    

}

module.exports = ProductService;