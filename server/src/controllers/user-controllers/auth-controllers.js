const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../../models/user-model')

// token generation utils
const {
    generateVerficationToken,
    generatePasswordResetToken,
    verifyEmailToken,
    verifyPasswordResetToken
} = require('../../utils/token-util')

// email verification utils
const {
    sendVerificationEmail,
    sendPasswordResetEmail
} = require('../../utils/emails-util')

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body
    try {
        // Check if user already exists
        const existingUser = await User.findByPk({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
        });

        // Generate verification token
        const verificationToken = generateVerficationToken(newUser.id);

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({
            message: 'User registered successfully. Please verify your email.',
            user: newUser
        })
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal server error' });
        
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        // Check if user exists
        const user = await User.findByPk({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ 
            id: user.id, 
            role: user.role, 
            verified: user.isVerified 
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isVerified: user.isVerified,
            }
        })
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const verifyEmail = async (req, res) => {
    const { token } = req.params
    try {
        // Verify the token
        const decoded = verifyEmailToken(token);
        if (!decoded) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Update user verification status
        const updatedUser = await User.update(
            { isVerified: true },
            { where: { verificationToken: token } }
        );
        if (!updatedUser) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        res.status(200).json({ message: 'Email verified successfully' })
    } catch (error) {
        console.error('Error verifying email:', error);
        if(error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Token expired' });
        }
        if(error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: 'Invalid token' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const requestPasswordReset = async (req, res) => {
    const { email } = req.body
    try {
        // Check if user exists
        const user = await User.findByPk({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Generate password reset token
        const passwordResetToken = generatePasswordResetToken(user.id);

        // Send password reset email
        await sendPasswordResetEmail(email, passwordResetToken);

        res.status(200).json({ message: 'Password reset email sent successfully' })
    } catch (error) {
        console.error('Error requesting password reset:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body
    try {
        // Verify the token
        const decoded = verifyPasswordResetToken(token);
        if (!decoded) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password
        const updatedUser = await User.update(
            { password: hashedPassword },
            { where: { id: decoded.userId } }
        );
        if (!updatedUser) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        res.status(200).json({ message: 'Password reset successfully' })
    } catch (error) {
        console.error('Error resetting password:', error);
        if(error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Token expired' });
        }
        if(error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: 'Invalid token' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    registerUser,
    loginUser,
    verifyEmail,
    requestPasswordReset,
    resetPassword
}