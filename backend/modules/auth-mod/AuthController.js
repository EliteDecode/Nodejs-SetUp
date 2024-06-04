const AuthService = require('./AuthService');
const asyncHandler = require("express-async-handler");
const logger = require('../../utils/logging');

const authService = new AuthService();

const createUser = asyncHandler (async (req,res) => {
    const { firstName, lastName, email, password, password2 } = req.body;
    if (!firstName || !lastName || !email || !password || !password2) {
        return res.status(400).json({ success: false, error: "Provide all fields", data: null });
    } 
})
async function createUser2(req, res) {
    try {
        const { firstName, lastName, email, password, password2 } = req.body;
        if (!firstName || !lastName || !email || !password || !password2) {
            return res.status(400).json({ success: false, error: {
                code: 'MISSING_FIELDS',
                message: 'Request missing required fields.'
            } });
        }
        const user = await authService.createUser(firstName, lastName, email, password);
        if (!user) {
            return res.status(424).json({ success: false, error: {
                code: 'SERVER_ERROR',
                message: "User not created succesfully. Check logs for more details."
            } });
        }
        logger.info("New User Created", {module: "Auth", UID: user._id, action: "createUser"});
        res.status(201).json({ success: true, data: user, message: "User Created Successfully." });
    } catch (error) {
        res.status(500).json({ success: false, error: {
            code: 'SERVER_ERROR',
            message: error.message
        } });
    }
}

const verifyEmail = asyncHandler (async (req,res) => {

})


async function verifyEmail2(req, res) {
    try {
        const { token } = req.params;
        const user = await authService.verifyEmail(token);
        if (!user) {
            return res.status(400).json({ success: false, error: {
                code: 'SERVER_ERROR',
                message: 'Email Verification Failed. Check the logs for more information.'
            } });
        }
        logger.info("Email Verified Successfully.", { module: "Auth", UID: user._id });
        res.json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: {
            code: 'SERVER_ERROR',
            message: error.message
        } });
    }
}

// async function blacklistUser(req, res) {
//     try {
//         const { userId } = req.body;
//         const user = await authService.blacklistUser(userId);
//         if (!user) {
//             return res.status(424).json({ success: false, error: {
//                 code: 'SERVER_ERROR',
//                 message: 'Failed to blacklist user. Check logs for more details.'
//             } });
//         }
//         res.status(200).json({ success: true, data: user, message: 'User blacklisted successfully.' });
//     } catch (error) {
//         res.status(500).json({ success: false, error: {
//             code: 'SERVER_ERROR',
//             message: error.message
//         } });
//     }
// }

// async function whitelistUser(req, res) {
//     try {
//         const { userId } = req.body;
//         const user = await authService.unblacklistUser(userId);
//         if (!user) {
//             return res.status(424).json({ success: false, error: {
//                 code: 'SERVER_ERROR',
//                 message: 'Failed to whitelist user. Check logs for more details.'
//             }});
//         }
//         res.json({ success: true, data: user, message: 'User whitelisted successfully.' });
//     } catch (error) {
//         res.status(500).json({ success: false, error: {
//             code: 'SERVER_ERROR',
//             message: error.message
//         } });
//     }
// }

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const user = await authService.loginUser(email, password);
        if (!user) {
            return res.status(401).json({ success: false, error: {
                code: `SERVER_ERROR`,
                message: 'Login failed. Check logs for more information.'
            } });
        }
        res.status(200).json({ success: true, data: user, message: 'User logged in successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: {
          code: 'SERVER_ERROR',
          message: error.message
        }});
    }
}

async function logoutUser(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, error: {
                code: 'UNAUTHORIZED',
                message: "Please log in again."
            } });
        }
        const userId = req.user._id;
        await authService.logoutUser(userId);
        res.status(200).json({ success: true, message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: {
            code: 'SERVER_ERROR',
            message: error.message
        } });;
    }
}

async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        await authService.forgotPassword(email);
        res.status(200).json({ success: true, message: 'Password reset email sent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: {
            code: 'SERVER_ERROR',
            message: error.message
        } });
    }
}

async function resetPassword(req, res) {
    try {
        const { token, password } = req.body;
        const user = await authService.resetPassword(token, password);
        if (!user) {
            return res.status(400).json({ success: false, error: {
                code: 'SERVER_ERROR',
                message: 'Password Reset Failed. Check the logs for more info.'
            } });
        }
        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: {
            code: 'SERVER_ERROR',
            message: error.message
        } });
    }
}

async function startEmailVerification(req, res) {
    try {
        const { email } = req.body;
        await authService.startEmailVerification(email);
        res.json({ success: true, message: 'Verification email sent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: {
            code: 'SERVER_ERROR',
            message: error.message
        } });
    }
}



async function deleteUser(req, res) {
    try {
        const { userId } = req.body;
        const user = await authService.deleteUser(userId);
        if (!user) {
            return res.status(400).json({ success: false, error: {
                code: 'SERVER_ERROR',
                message: 'Failed to delete user. Check logs for more details.'
            } });
        }
        logger.info("User Deleted Successfully.", { module: "Auth", UID: userId });
        res.json({ success: true, data: user, message: "User Deleted Successfully." });
    } catch (error) {
        res.status(500).json({ success: false, error: {
            code: 'SERVER_ERROR',
            message: error.message
        } });
    }
}

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    deleteUser,
    // blacklistUser,
    // whitelistUser,
    forgotPassword,
    resetPassword,
    startEmailVerification,
    verifyEmail,
};
