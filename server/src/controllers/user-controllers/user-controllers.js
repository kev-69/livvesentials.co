const User = require('../../models/user-model');
const Address = require('../../models/address-model');

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have user ID in req.user
        const user = await User.findByPk(userId, {
        include: [{ model: Address }], // Include the Adress model
        });
    
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }
    
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have user ID in req.user
        const { firstName,lastName, phone } = req.body;
    
        const user = await User.findByPk(userId);
    
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.phone = phone || user.phone;
    
        await user.save();
    
        return res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const addUserAddress = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have user ID in req.user
        const { addressLine1, addressLine2, city, state, country } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const address = await Address.create({
            userId,
            addressLine1,
            addressLine2,
            city,
            state,
            country,
        });

        return res.status(201).json({ message: 'User address added successfully', address });
    } catch (error) {
        console.error('Error adding user address:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const updateUserAddress = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have user ID in req.user
        const { addressId } = req.params; // Assuming addressId is passed as a URL parameter
        const { addressLine1, addressLine2, city, state, country } = req.body;

        const user = await User.findByPk(userId, {
            include: [{ model: Address }], // Include the Address model
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const address = await Address.findByPk(addressId);

        if (!address || address.userId !== userId) {
            return res.status(404).json({ message: 'Address not found or does not belong to the user' });
        }

        // Update only the fields provided in the request body
        if (addressLine1 !== undefined) address.addressLine1 = addressLine1;
        if (addressLine2 !== undefined) address.addressLine2 = addressLine2;
        if (city !== undefined) address.city = city;
        if (state !== undefined) address.state = state;
        if (country !== undefined) address.country = country;

        await address.save();

        return res.status(200).json({ message: 'User address updated successfully', address });
    } catch (error) {
        console.error('Error updating user address:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteUserAddress = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have user ID in req.user
        const { addressId } = req.params; // Assuming addressId is passed as a URL parameter
    
        const user = await User.findByPk(userId, {
            include: [{ model: Address }], // Include the Address model
        });
    
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        const address = await Address.findByPk(addressId);
    
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
    
        await address.destroy();
    
        return res.status(200).json({ message: 'User address deleted successfully' });
    } catch (error) {
        console.error('Error deleting user address:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const getUserAddresses = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have user ID in req.user
    
        const user = await User.findByPk(userId, {
            include: [{ model: Address }], // Include the Address model
        });
    
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        return res.status(200).json(user.Addresses); // Return the user's addresses
    } catch (error) {
        console.error('Error fetching user addresses:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [{ model: Address }], // Include the Address model
        });
    
        if (!users) {
            return res.status(404).json({ message: 'No users found' });
        }
    
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id; // Assuming user ID is passed as a URL parameter
    
        const user = await User.findByPk(userId, {
            include: [{ model: Address }], // Include the Address model
        });
    
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getUserProfile,
    updateUserProfile,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,
    getUserAddresses,
    getAllUsers,
    getUserById,
};