const ProfileService = require("./ProfileService")

const profileService = new ProfileService()

class ProfileController {

    async addAddress (req,res) {
        req.body.user = req.user.userId;
        const address = await profileService.addAddress(req.body,res);
        if(!address) return res.status(500).json({success:false,message:"Error adding address."});
        return res.status(201).json({success:true,message:"Address added.",data:address});
    }

    async editAddress (req,res) {
        req.body.user = req.user.userId
        const address = await profileService.editAddress(req.body,res,req.params.id);
        if(!address) return res.status(400).json({success:false,message:"Please Provide All Fields."});
        return res.status(200).json({success:true,message:"Address Updated Successfully",data:address});
    }

    async deleteAddress (req,res) {
        const address = await profileService.deleteAddress(req.user.userId,res,req.params.id);
        if(!address) return res.status(400).json({success:false,message:"Please Provide valid id."});
        return res.status(200).json({success:true,message:"Address Deleted Successfully"});
    }

    async getAddress (req,res) {
        const address = await profileService.getAddress(req.user.userId,req.params.id);
        return res.status(200).json({success:true,message:"User Address Sent Successfully",data:address});
    }

}

module.exports = ProfileController;