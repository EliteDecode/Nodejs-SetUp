const ProductService = require("./ProductService");

const productService = new ProductService();

class ProductController {

    async createProduct (req,res){
        if(req.user.role != "seller")return res.status(403).json({success:false,message:"You must be an seller to perform this action"});
        req.body.seller = req.user.userId;
        const product = await productService.createProduct(req,res);
        return res.status(201).json({success: true,message:"Product added Successfully", data: product});
    }

    async getAllProduct (req,res){
        const products = await productService.getAllProduct(req);
        return res.status(201).json({success: true,message:"Products sent successfully", data: products})
    }

    async getProduct (req,res){
        const product = await productService.getProduct(req.params.id);
        if(!product){
            return res.status(404).json({success: false, message: "No such product"})
        }
        return res.status(201).json({success: true,message:"Product sent successfully", data: product});
    }

    async getAllProductBySeller (req,res){
        const products = await productService.getAllProduct(req);
        return res.status(201).json({success: true,message:"products sent successfully", data: products})
    }

    // async updateProduct (req,res){
    //     const updateProduct = await productService.updateProduct(req);
    //     return res.status(201).json({success: true,message:"Product Updated Successfully", data: products})
    // }

    async deleteProduct (req,res){
        await profileService.deleteProduct(req,res);
        return res.status(201).json({success: true,message:"Product Deleted Successfully"})
    }

}

module.exports = ProductController;