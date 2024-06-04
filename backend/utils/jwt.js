const jwt = require("jsonwebtoken")

export const generateJWT = (user) => {
    const token = jwt.sign(user,'secret',{expiresIn: 1000 * 5});
    return token
}

export const verifyToken = (token) => {
    const isVerifiedToken = jwt.verify(token,'secret');
    return isVerifiedToken
}