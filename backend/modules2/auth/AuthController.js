const AuthService = require("./AuthService");

const authService = new AuthService();

class Authcontroller{

    async registerUser (req,res) {
        const {email,password,fullname} = req.body;
        if(!email || !password || !fullname) return res.status(400).json({status:false,message:"Please Provide all fields."});
        const user = await authService.registerUser(req.body);
        if(!user) return res.status(400).json({success:false,message:"User already has an account, Check Email To Verify Account."});
        return res.status(200).json({success:true,message:"User created successfully",data:user});
    }

    async verifyEmail (req,res) {
        const userData = {token:req.params.token,code:req.body.code};
        const verifyUserEmail = await authService.verifyEmail(userData,res);
        if(!verifyUserEmail) return res.status(400).json({success:false,message:"Invalid Code"});
        return res.status(200).json({success:true,message:"User Verified"})
    }

    async resendVerifyEmailCode (req,res) {
        const user = await authService.resendVerifyEmailCode(req.body.email,res);
        if(!user) return res.status(404).json({status:false,message:"Invalid Email"});
        return res.status(200).json({success:true,message:"Check your email for code",data:user})
    }

    async loginUser (req,res) {
        const {email,password} = req.body;
        if(!email || !password) return res.status(400).json({success:false,message:"Please Provide all fields."});
        const data = await authService.loginUser(req.body,res);
        const {password: userPassword,...rest} = data.user.toJSON();
        return res.status(201).json({success:true,data:{user:rest,token:data.token},message:"User Login Successful"})
    }

    async forgotPassword (req,res) {
        if(!req.body.email) return res.status(400).json({status:false,message:"Email is required"});
        const message = await authService.forgotPassword(req.body.email);
        if(!message) return res.status(404).json({success:false,message:"Invalid Email Address."});
        return res.status(200).json({success:true,message:"Code has been sent to your mail",data:message})
    }

    async verifyForgotPasswordCode (req,res) {
        const {code} = req.body;
        if(!code) return res.status(400).json({status:400,message:"Provide code"})
        const result = await authService.verifyForgotPasswordCode({code,token:req.params.token},res);
        if(!result) return res.status(400).json({status:false,message:"Invalid Code"});
        return res.status(200).json({status:true,message:"Proceed to change password."})
    }

    async resendForgotPasswordOtp(req,res) {
        const user = await authService.resendForgotPasswordOtp(req.body.email);
        if(!user) return res.status(404).json({status:false,message:"Invalid Email"});
        return res.status(200).json({success:true,message:"Check your email for code",data:user})
    }

    async resetPassword (req,res) {
        const {email,password} = req.body;
        if(!email || !password) return res.status(400).json({status:false,message:"Provide All Fields."});
        const user = await authService.resetPassword({email,password});
        if(!user) return res.status(404).json({status:false,message:"Invalid Email"});
        return res.status(200).json({status:true,message:"Password Changed."})
    }

    async logout (req,res) {

    }

    // protected pages
    async changePassword (req,res) {
        // add user to req.body
        req.body.user = req.user.userId
        await authService.changePassword(req.body)
        return res.status(200).json({status:true,message:"Proceed to change password."})
    }

    async becomeASeller (req,res){

    }

}

module.exports = Authcontroller;