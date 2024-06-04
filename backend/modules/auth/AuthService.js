const AuthRepository = require('./AuthRepository');
const sendMail = require('../../utils/EmailUtils');
const ProfileRepository = require('../profiles/ProfileRepository')
const AccessTokenService = require('./TokenService');
const bcrypt = require('bcryptjs');
const logger = require('../../utils/logging');

const authRepo = new AuthRepository();
const ATS = new AccessTokenService();
const profileRepo = new ProfileRepository();

class AuthService {
    
    async createUser(firstName, lastName, email, password) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const userExists = await authRepo.getUserByEmail(email); 
            if (userExists) {
                throw new Error('User already exists');
            }
            const user = await authRepo.addUser(firstName, lastName, email, hashedPassword);

            if (user) {
                const accessToken = await ATS.generate(user._id);
                const refreshToken = await authRepo.generateRefreshToken(user._id);
                const profile = profileRepo.initProfile(user._id);
               // await this.startEmailVerification(email);
                // await this.startEmailVerification(email);
                return { user, token: accessToken, profile };
            }
            return null;
        } catch (error) {
            logger.error(error.message, {module: "Auth", action: "createUser", error});
            return null
        }
    }

    async loginUser(email, password) {
        try {
            const user = await authRepo.getUserByEmail(email);
            if (user) {
                const isMatch = await bcrypt.compare(password, user.Password);
                if (isMatch) {
                    const accessToken = await ATS.generate(user._id);
                    await authRepo.destroyToken(user._id);
                    const refreshToken = await authRepo.generateRefreshToken(user._id);
                    return { user, token: accessToken };
                } else {
                    throw new Error('Invalid password');
                }
            } else {
                throw new Error('User not found or is not verified.');
            }
        } catch (error) {
            logger.error(error.message, {module: "Auth", action: "loginUser", error});
            throw error;
        }
    }

    // logger.info, logger.warn, logger.error, 
    // logger.debug, logger.silly, logger.fatal

    async logoutUser(userId) {
        try {
            const user = await authRepo.destroyToken(userId);
            return user;
        } catch (error) {
            logger.error(error.message, {module: "Auth", action: "logoutUser", error});
            throw error;
        }
    }

    async forgotPassword(email) {
        try {
            const user = await authRepo.getUserByEmail(email);
            if (user) {
                const sixDigits = Math.floor(100000 + Math.random() * 900000);
                await authRepo.updateVerifToken(user._id, sixDigits);
                const accessToken = await ATS.generateForVerification(user._id);
                const html = `
                    <h1>Reset Password</h1>
                <p>Hi there, ${user.Firstname}</p>
                    <p>Please use the following code to reset your password:</p>
                    <h2>${sixDigits}</h2>
                    <p>This code will expire in 15 minutes.</p>
                    <p>Click on the link below to reset your password:</p>
                    <a href="${process.env.FRONTEND_URL}/auth/reset-password/${accessToken}">Reset Password</a>
                    <p>If you did not request a password reset, please ignore this email.</p>`
            }
            await sendMail(email, 'Reset Password', html);
            return true;
        } catch (error) {
            logger.error(error.message, {module: "Auth", action: "forgotPassword", error});
            throw error;
        }
    }

    async blacklistUser(userId) {
        try {
            const user = await authRepo.markUserAsBlacklisted(userId);
            return user;
        } catch (error) {
            logger.error(error.message, {module: "Auth", action: "blacklistUser", error});
            throw error;
        }
    }

    // TODO: Become a seller function - provide documents.

    async unblacklistUser(userId) {
        try {
            const user = await authRepo.removeUserFromBlacklist(userId);
            return user;
        } catch (error) {
            logger.error(error.message, {module: "Auth"});
            throw error;
        }
    }

    async resetPassword (token, password) {
        try {
            const user = await authRepo.verifyToken(token);
            if (user) {
                const hashedPassword = await bcrypt.hash(password, 10);
                const updatedUser = await authRepo.updateUser(user._id, { password: hashedPassword });
                await authRepo.nullifyVerifToken(user._id);
                return updatedUser;
            }
            return null;
        } catch (error) {
            logger.error(error.message, {module: "Auth", action: "resetPassword", error});
            throw error;
        }
    }

    async deleteUser (userId) {
        try {
            // call recursive deletion functions
            const deletedUser = await authRepo.deleteUser(userId);
            return deletedUser;
        } catch (error) {
            logger.error(error.message, {module: "Auth", action: "deleteUser", error});
            throw error;
        }
    }

    async startEmailVerification(email) {
        try {
            const user = await authRepo.getUserByEmail(email);
            if (user) {
                const accessToken = await ATS.generateForVerification(user._id);
                const html = `
                    <h1>Verify Email</h1>
                <p>Hi there, ${user.Firstname}</p>
                    <p>Please use the following link to verify your email:</p>
                    <a href="${process.env.FRONTEND_URL}/auth/verify-email/${accessToken}">Verify Email</a>
                    <p>This link expires in 15 minutes.</p>
                    <p>If you did not request an email verification, please ignore this email.</p>`
                    await sendMail(email, 'Verify Your Email, ' + user.Firstname, html);
                    return true;
            } else {
                throw new Error("User not found.")
            }
        } catch (error) {
            logger.error(error.message, {module: "Auth", action: "startEmailVerification", error});
            throw error;
        }
    }

    async verifyEmail (token) {
        try {
            const user = await ATS.verify(token);
            if (user) {
                const updatedUser = await authRepo.updateVerifToken(user.user._doc._id, null);
                await authRepo.markUserAsVerified(user.user._doc._id);
                return updatedUser;
            } else {
                return null;
            }
        } catch (error) {
            logger.error(error.message, {module: "Auth", action: "verifyEmail", error});
            throw error;
        }
    }
}

module.exports = AuthService;