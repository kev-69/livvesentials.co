const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateVerficationToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
}

const generatePasswordResetToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
}

const verifyEmailToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
}

const verifyPasswordResetToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
}

module.exports = {
    generateVerficationToken,
    generatePasswordResetToken,
    verifyEmailToken,
    verifyPasswordResetToken
}