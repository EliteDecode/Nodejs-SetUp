const SellerService = require("./SellerService");

const sellerService = new SellerService();

class SellerController {

    async sendCode (req,res) {
        if(!req.body.email) return res.status(400).json({success:false,message:"Email is required"})
        req.body.userId = req.user.userId;
        const code = await sellerService.sendCode(req.body);
        if(!code) return res.status(404).json({status:false,message:"Invalid Email"});
        return res.status(200).json({success:true,messgae:"Check Mail For Code",code})
    }

    async resendCode (req,res) {
        if(!req.body.email) return res.status(400).json({success:false,message:"Email is required"})
        req.body.id = req.user.userId;
        const code = await sellerService.resendCode(req.body);
        if(!code) return res.status(404).json({status:false,message:"Invalid Email"});
        return res.status(200).json({success:true,messgae:"Check Mail For Code",code})
    }

    async createBusiness (req,res) {
        req.body.id = req.user.userId;
        const data = await sellerService.createBusiness(req.body,res);
        return res.status(201).json({success:true,message: "Business Registered", data})
    }

    async billing (req,res) {
        // only users that are sellers should create business

    }

    async getBusiness (req,res) {
        const business = await sellerService.getBusiness(req.user.userId);
        if(!business) return res.status(400).json({sucess:false,message:"You are not a seller."});
        return res.status(201).json({success:true,message:"Business sent",business});
    }

    async verifyBusiness (req,res) {
        // only users that are sellers should create business
        const data = await sellerService.verifyBusiness({verificationIdentity:req.body,file:req.file},res);
        return res.status(201).json({success:true,message:"Business verified",data});
    }

}

module.exports = SellerController;