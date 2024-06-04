const ProductModel = require("./ProductModel");
const logger = require("../../utils/logging")

class ProductService {
    async createProduct (product ) {
        try {
            const newProduct = await ProductModel.create(product);
            return newProduct;
        } catch (error) {
            logger.error(error.message, {module: "Product", action: "createProduct", error});
            throw error;
        }
    }

    async getAllProducts (query) {
        try {
            const products = await ProductModel.find(query);
            return products;
        } catch (error) {
            logger.error(error.message, {module: "Product", action: "getAllProduct", error});
            throw error;
        }
    }
    
    async getProductById(id){
        try {
            const product = await ProductModel.findById({_id:id}).populate("reviews");
            console.log(product);
            return product
        } catch (error) {
            logger.error(error.message, {module: "Product", action: "getProductById", error});
            throw error;
        }
    }

    async updateProduct(id,product,user){
        try {
            const updatedProduct = await ProductModel.findOneByIdAndUpdate({_id:id,user},product,{new:true});
            return updatedProduct
        } catch (error) {
            logger.error(error.message, {module: "Product", action: "updateProduct", error});
            throw error;
        }
    }

    async deleteProduct(id,user){
        try {
            const updatedProduct = await ProductModel.findOneByIdAndDelete({_id:id,user},{new:true});
            return updatedProduct
        } catch (error) {
            logger.error(error.message, {module: "Product", action: "deleteProduct", error});
            throw error;
        }
    }

    async uploadImages(id,user,product){
        try {
            
        } catch (error) {
            
        }
    }
}

module.exports = ProductService;