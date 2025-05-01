const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    orderStatus: {
        type: DataTypes.ENUM('processing', 'shipped', 'completed', 'cancelled'),
        defaultValue: 'pending',
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'failed'),
        defaultValue: 'pending',
    },
    paymentMethod: {
        type: DataTypes.ENUM('CreditCard', 'MobileMoney'),
        defaultValue: 'MobileMoney',
    }
},  {
    timestamps: true,
    tableName: 'orders',
})

// Order.associate = (models) => {
//     Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
//     Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
//     Order.hasMany(models.ShippingAddress, { foreignKey: 'orderId', as: 'shippingAddress' });
//     Order.hasMany(models.BillingAddress, { foreignKey: 'orderId', as: 'billingAddress' });
// }

module.exports = Order;