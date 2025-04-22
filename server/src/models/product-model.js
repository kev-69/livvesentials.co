const sequelize = require('../config/db')
const { DataTypes } = require('sequelize');
const Category = require('./category-model');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    stockQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Category,
            key: 'id',
        },
        onDelete: 'SET NULL', // set categoryId to null if category is deleted
        onUpdate: 'CASCADE',
    },
    productImages: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: 'products',
})

// associations
Product.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(Product, { foreignKey: 'categoryId' });

module.exports = Product;