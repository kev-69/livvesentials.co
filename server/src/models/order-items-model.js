const sequelize = require('../config/db')
const { DataTypes } = require('sequelize');
const Order = require('./order-model');

const OrderItems = sequelize.define('OrderItems', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Order,
            key: 'id',
        },
        onDelete: 'CASCADE', // delete order items if order is deleted
        onUpdate: 'CASCADE',
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: 'order_items',
})

// associations
OrderItems.belongsTo(Order, { foreignKey: 'orderId' });
Order.hasMany(OrderItems, { foreignKey: 'orderId' });

module.exports = OrderItems;