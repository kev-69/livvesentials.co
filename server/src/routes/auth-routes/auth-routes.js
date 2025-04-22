const express = require('express');
const router = express.Router();


const {
    registerUser,
    loginUser,
    verifyEmail,
    requestPasswordReset,
    resetPassword
} = require('../../controllers/user-controllers/auth-controllers');

// middleware
const {
    validateToken,
    validateEmail,
    validatePassword,
    sanitizeInput,
    rateLimiterLogin,
    rateLimiterVerifyEmail,
    validateTokenStructure,
    rateLimiterPasswordResetRequest,
    verifyResetToken,
} = require('../../middlewares/auth-middlewares');

// routes
router.post('/register', validateEmail, validatePassword, sanitizeInput, registerUser);

router.post('/login', validateEmail, sanitizeInput, rateLimiterLogin, loginUser);

router.post('/verify-email', sanitizeInput, rateLimiterVerifyEmail, validateTokenStructure, verifyEmail);

router.post('/request-password-reset', sanitizeInput, rateLimiterPasswordResetRequest, validateToken, requestPasswordReset);

router.post('/reset-password', validatePassword, sanitizeInput, validateToken, verifyResetToken, resetPassword);

// export router
module.exports = router;