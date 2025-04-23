const express = require('express');
const router = express.Router()

const {
    getUserProfile,
    updateUserProfile,
    addUserAddress,
    updateUserAddress,
    getUserAddresses,
    deleteUserAddress
} = require('../../controllers/user-controllers/user-controllers');

const {
    validateToken,
    CheckEmailVerified
} = require('../../middlewares/user-middlewares')

// routes
router.get('/profile', validateToken, getUserProfile);
router.put('/profile', validateToken, CheckEmailVerified, updateUserProfile);
router.post('/address', validateToken, CheckEmailVerified, addUserAddress);
router.put('/address/:addressId', validateToken, CheckEmailVerified, updateUserAddress);
router.get('/addresses', validateToken, getUserAddresses);
router.delete('/address/:addressId', validateToken, deleteUserAddress);

module.exports = router;