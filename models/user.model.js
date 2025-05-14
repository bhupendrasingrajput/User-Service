import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    otp: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    refreshToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'users',
    schema: 'public',
    timestamps: true,
});

export default User;
