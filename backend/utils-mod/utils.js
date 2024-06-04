const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt);
}

const comparePassword = async (password, dbPassword = "") => {
    return bcrypt.compare(password,dbPassword);
}


const generateJWT = (userId,role,expires=process.env.JWT_EXPIRES) => {
    console.log(userId,role);
    const token = jwt.sign({userId,role},process.env.JWT_SECRET,{expiresIn:expires});
    return token;
}

const verifyToken = (token) => {
    return jwt.verify(token,process.env.JWT_SECRET);
}


const generateOtp = () => {
    const multiplyBy = Math.floor(Math.random() * 10) * 100000 || 100000;
    const otpEmailVerify =  Math.floor((Math.random() * 100000) + multiplyBy);
    return otpEmailVerify;
}

module.exports = {encryptPassword,comparePassword,generateJWT,verifyToken,generateOtp}