const { generateJWT, generateOtp, verifyToken } = require("../../utils-mod/utils");
const UserModel = require("../auth/UserModel");
const SellerModel = require("./SellerModel");

class SellerService {

    // ################################ SEND CODE ########################################### //

    async sendCode ({userId,email}) {
        const user = await UserModel.findOne({_id:userId,email});
        if(!user) return false;
        const code = generateOtp();
        user.businessCode = code;
        // send code via mail;
        await user.save();
        return code; // development
        return true; //production
    }

    // async verifyCode ({userData}) {
    //     const token = verifyToken(userData.token);
    //     if(!token) return false;
    //     const user = await UserModel.findById({_id:userData.id});
    //     if(!user) return false;
    //     if(userData.code !== user.businessCode)
    // }


    // ################################ RESEND CODE ########################################### //

    async resendCode ({id,email}) {
        const user = await UserModel.findOne({_id:id,email});
        if(!user) return false;
        const code = generateOtp();
        user.businessCode = code;
        await user.save()
        // send code via mail;
        return {code}; // development
        return true; //production
    }


    // ################################ CREATE BUSINESS ########################################### //

    async createBusiness (userData,res) {
        // only users that are sellers should create business
        const {businessName,businessRegistrationNumber,code,id,country,state,zipCode,addressOne} = userData;
        if(!businessName || !businessRegistrationNumber || !code || !country || !state || !zipCode || !addressOne){
            res.status(400);
            throw new Error ("Please Provide All Fields")
        }
        const user = await UserModel.findById({_id:id});
        const seller = await SellerModel.findOne({user:id});
        if(seller){
            res.status(400);
            throw new Error("You own a business already.")
        }
        console.log(user.businessCode,code);
        if(code !== user.businessCode){
            res.status(400);
            throw new Error ("Invalid Code.")
        }
        // create business
        const businessAddress = {country,state,zipCode,addressOne};
        const business = await SellerModel.create({businessName,businessRegistrationNumber,businessAddress,user:user._id})
        user.role = "seller";
        user.businessCode = null;
        user.sellerId = business._id;
        // save user
        await user.save();
        // update login after this
        const token =  generateJWT(user._id,user.role);
        return {business,token};
    }

    async billing ({user}) {
        // only users that are sellers should create business

    }

    async getBusiness (user) { 
        console.log(user);
        const seller = await SellerModel.findOne({user});
        console.log(seller);
        if(!seller) return false;
        return seller;
    }

    async verifyBusiness (userData,res) {
        // only users that are sellers should create business
        const {verificationIdentity,file,businessId} = userData;
        if(!verificationIdentity) {
            res.status(400);
            throw new Error ("Please Provide Verification Identity.")
        }
        if (!file) {
            res.status(400);
            throw new Error("Provide document")
        }
        const seller = await SellerModel.findById({_id:businessId});
        if(!seller){
            res.status(404);
            throw new Error ("No Business Found")
        }
        // upload file to cloud
        try {
            const upload = await cloudinary.uploader.upload(file.path, {
                folder: "Seller Verification"
            });
            await fs.unlink(file.path)
            seller.verificationFile = { publicId: upload.public_id, secureUrl: upload.secure_url };
            seller.verificationIdentity = verificationIdentity;
            seller.status = "verified";
            return seller;
        } catch (error) {
            console.log(error);
            res.status(400);
            throw new Error ("Error uploading document.");
        }
    }
    
}

module.exports = SellerService;