const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const User = require('./user-model');
const Product = require('./product-model'); // Adjust the path as necessary

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Product,
            key: 'id',
        },
        onDelete: 'CASCADE', // delete cart item if product is deleted
        onUpdate: 'CASCADE', // update cart item if product is updated
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: 'carts',
});

// Associations
Cart.belongsTo(User, { foreignKey: 'userId' }); // cart belongs to user
User.hasMany(Cart, { foreignKey: 'userId' }); // user has many carts
Cart.belongsTo(Product, { foreignKey: 'productId' }); // cart belongs to product
Product.hasMany(Cart, { foreignKey: 'productId' }); // product has many carts

module.exports = Cart;