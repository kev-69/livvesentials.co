const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log('Authorization Header:', authHeader); // Debugging

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  // console.log('Token:', token); // Debugging

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId, verified: decoded.verified }; // Attach user ID and verified status
    // console.log('Decoded user:', req.user); // Debugging
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const CheckEmailVerified = (req, res, next) => {
    // Check if the user is verified
    if (!req.user || !req.user.verified) {
        // console.log('User not authenticated or verified:', req.user); // Debugging
        return res.status(403).json({ message: 'User not authenticated' });
    }

    // Check if the user has verified their email
    // Assuming req.user.verified is a boolean indicating email verification status
    // console.log('User verification status:', req.user.verified); // Debugging
    
    if (!req.user.verified) {
        return res.status(403).json({ message: 'Email not verified' });
    }

    next();
};

module.exports = {
    validateToken,
    CheckEmailVerified,
};