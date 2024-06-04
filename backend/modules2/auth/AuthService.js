const { encryptPassword, comparePassword, generateJWT, verifyToken, generateOtp } = require("../../utils-mod/utils");
const ProfileModel = require("../profile/ProfileModel");
const UserModel = require("./UserModel");

class AuthService {

    async registerUser (userData) {
        const {password,email} = userData;
        const userExist = await UserModel.findOne({email});
        if(userExist) return false;
        const hashedPassword = await encryptPassword(password);
        userData.password = hashedPassword;
        const code = generateOtp();
        userData.verifyOtp = code;
        userData.isVerified = false;
        userData.role = "user";
        const user = await UserModel.create(userData);
        const token =  generateJWT(user._id,user.role,"2m");
        user.token = token; // delete this line in prducttion
        // create profile
        // send token  and code via email
        return {user,token};
    }


    async verifyEmail (userData,res) {
        let token;
        console.log(userData.token);
        try {
            token = verifyToken(userData.token);
        } catch (error) {
            res.status(400);
            throw new Error("Expired Code.")
        }
        console.log(token);
        const {userId} = token;
        console.log(userId);
        const user = await UserModel.findById({_id:userId});
        const profile = await ProfileModel.findOne({user:userId});
        if(!profile){
            await ProfileModel.create({user:userId});
        }
        console.log(user.verifyOtp,userData.code);
        if(user.verifyOtp != userData.code) return false;
        user.isVerified = true;
        user.verifyOtp = null;
        await user.save();
        return true;
    }


    async resendVerifyEmailCode (email,res) {
        const user = await UserModel.findOne({email});
        if(!user) return false
        if(user.isVerified){
            res.status(400)
            throw new Error("User already verified")
        }
        const token =  generateJWT(user._id,user.role,"2m");
        const code = generateOtp();
        user.verifyOtp = code;
        await user.save();
        // send token  and code via email
        // return true;
        return {user,token};
    }


    async loginUser (userData,res) {
        const {password,email} = userData;
        const user = await UserModel.findOne({email});
        const decryptPassword = await comparePassword(password,user?.password);
        if(!user || !decryptPassword){
            res.status(400);
            throw new Error("Invalid Credentials")
        }
        if(!user.isVerified){
            res.status(400);
            throw new Error("Please Verify Your Account.")
        }
        const token =  generateJWT(user._id,user.role);
        // user.token = token;
        return {user,token};
    }


    async forgotPassword (email) {
        const user = await UserModel.findOne({email});
        if(!user) return false;
        const token =  generateJWT(user._id,user.role,"2m");
        const code = generateOtp();
        user.forgotPasswordOtp = code;
        // send mail
        // await sendEmail({subject:"Verify Email",email,message:forgotPasswordOtp})
        await user.save();
        // return true //keep this
        //delete this
        return {user,token} //delete this
    }


    async verifyForgotPasswordCode (userData,res) {
        let token;
        try {
            token = verifyToken(userData.token);
        } catch (error) {
            res.status(400);
            throw new Error("Expired Code.")
        }
        const {userId} = token;
        const user = await UserModel.findOne({_id:userId});
        if(user.forgotPasswordOtp != userData.code) return false;
        user.forgotPasswordOtp = null;
        await user.save();
        return true;
    }


    async resendForgotPasswordOtp (email) {
        const user = await UserModel.findOne({email});
        if(!user) return false;
        const token = generateJWT(user._id,user.role,"2m");
        const code =  generateOtp();
        user.forgotPasswordOtp = code;
        // send mail
        // await sendEmail({subject:"Reset Password",email,message:forgotPasswordOtp});
        await user.save();
        // return true;
        return {user,token};
    }


    async resetPassword ({email,password}) {
        const user = await UserModel.findOne({email});
        console.log(user);
        if(!user)return false;
        user.password = await encryptPassword(password);
        await user.save();
        return true;
    } 


    async logout () {}

    async changePassword (userData,res) {
        const {newPassword, oldPassword,user} = userData;
        if(!newPassword || !oldPassword) {
            res.status(400);
            throw new Error("Provide all fields.")
        }
        const findUser = await UserModel.findById({user});
        const isCorrect = await comparePassword(newPassword,findUser?.password);
        if(!isCorrect){
            res.status(400);
            throw new Error("Password is incorrect")
        }
        const hashedPassword = await encryptPassword(oldPassword);
        findUser.password = hashedPassword;
        await findUser.save;
        return findUser;
    }

    async becomeASeller() {}


}


module.exports = AuthService;