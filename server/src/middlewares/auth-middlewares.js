const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const validateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = decoded; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    });
}

const validateEmail = (req, res, next) => {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    // Check if email format is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    next(); // Proceed to the next middleware or route handler
}

const validatePassword = (req, res, next) => {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUpperCase) {
        return res.status(400).json({ error: 'Password must contain at least one uppercase letter.' });
    }

    if (!hasLowerCase) {
        return res.status(400).json({ error: 'Password must contain at least one lowercase letter.' });
    }

    if (!hasNumber) {
        return res.status(400).json({ error: 'Password must contain at least one number.' });
    }

    if (!hasSpecialChar) {
        return res.status(400).json({ error: 'Password must contain at least one special character.' });
    }
    next();
};

const sanitizeInput = (req, res, next) => {
    const sanitize = (value) => {
        if (typeof value === 'string') {
            return value.replace(/<script.*?>.*?<\/script>/gi, '') // Remove script tags
                        .replace(/<.*?on\w+=".*?".*?>/gi, '') // Remove inline event handlers
                        .replace(/javascript:/gi, ''); // Remove javascript: URLs
        }
        return value;
    };

    const sanitizeObject = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitizeObject(obj[key]); // Recursively sanitize nested objects
            } else {
                obj[key] = sanitize(obj[key]);
            }
        }
    };

    if (req.body) sanitizeObject(req.body);
    if (req.query) sanitizeObject(req.query);
    if (req.params) sanitizeObject(req.params);

    next(); // Proceed to the next middleware or route handler
};

const rateLimiterLogin = (req, res, next) => {
    const loginAttempts = {};
    const MAX_ATTEMPTS = 5; // Maximum allowed attempts
    const TIME_WINDOW = 15 * 60 * 1000; // 15 minutes in milliseconds

    const ip = req.ip; // Get the IP address of the client

    if (!loginAttempts[ip]) {
        loginAttempts[ip] = { count: 1, firstAttempt: Date.now() };
    } else {
        const timeSinceFirstAttempt = Date.now() - loginAttempts[ip].firstAttempt;

        if (timeSinceFirstAttempt > TIME_WINDOW) {
            // Reset the count and timestamp after the time window
            loginAttempts[ip] = { count: 1, firstAttempt: Date.now() };
        } else {
            loginAttempts[ip].count += 1;

            if (loginAttempts[ip].count > MAX_ATTEMPTS) {
                return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
            }
        }
    }

    next(); // Proceed to the next middleware or route handler
};

const rateLimiterVerifyEmail = (req, res, next) => {
    const verifyEmailAttempts = {};
    const MAX_ATTEMPTS = 3; // Maximum allowed attempts
    const TIME_WINDOW = 10 * 60 * 1000; // 10 minutes in milliseconds

    const ip = req.ip; // Get the IP address of the client

    if (!verifyEmailAttempts[ip]) {
        verifyEmailAttempts[ip] = { count: 1, firstAttempt: Date.now() };
    } else {
        const timeSinceFirstAttempt = Date.now() - verifyEmailAttempts[ip].firstAttempt;

        if (timeSinceFirstAttempt > TIME_WINDOW) {
            // Reset the count and timestamp after the time window
            verifyEmailAttempts[ip] = { count: 1, firstAttempt: Date.now() };
        } else {
            verifyEmailAttempts[ip].count += 1;

            if (verifyEmailAttempts[ip].count > MAX_ATTEMPTS) {
                return res.status(429).json({ error: 'Too many email verification attempts. Please try again later.' });
            }
        }
    }

    next(); // Proceed to the next middleware or route handler
};

const validateTokenStructure = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(400).json({ error: 'Token is required.' });
    }

    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
        return res.status(400).json({ error: 'Invalid token structure.' });
    }

    next(); // Proceed to the next middleware or route handler
};

const rateLimiterPasswordResetRequest = (req, res, next) => {
    const passwordResetAttempts = {};
    const MAX_ATTEMPTS = 3; // Maximum allowed attempts
    const TIME_WINDOW = 10 * 60 * 1000; // 10 minutes in milliseconds

    const ip = req.ip; // Get the IP address of the client

    if (!passwordResetAttempts[ip]) {
        passwordResetAttempts[ip] = { count: 1, firstAttempt: Date.now() };
    } else {
        const timeSinceFirstAttempt = Date.now() - passwordResetAttempts[ip].firstAttempt;

        if (timeSinceFirstAttempt > TIME_WINDOW) {
            // Reset the count and timestamp after the time window
            passwordResetAttempts[ip] = { count: 1, firstAttempt: Date.now() };
        } else {
            passwordResetAttempts[ip].count += 1;

            if (passwordResetAttempts[ip].count > MAX_ATTEMPTS) {
                return res.status(429).json({ error: 'Too many password reset requests. Please try again later.' });
            }
        }
    }

    next(); // Proceed to the next middleware or route handler
};

const verifyResetToken = (req, res, next) => {
    const { resetToken } = req.body;

    if (!resetToken) {
        return res.status(400).json({ error: 'Reset token is required.' });
    }

    jwt.verify(resetToken, process.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(400).json({ error: 'Reset token has expired.' });
            }
            return res.status(400).json({ error: 'Invalid reset token.' });
        }

        req.user = decoded; // Attach decoded token data (e.g., user ID) to the request object
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = {
    validateToken,
    validateEmail,
    validatePassword,
    sanitizeInput,
    rateLimiterLogin,
    rateLimiterVerifyEmail,
    validateTokenStructure,
    rateLimiterPasswordResetRequest,
    verifyResetToken,
    // Other middlewares can be added here
}