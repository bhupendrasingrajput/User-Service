import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
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
    role: {
        type: DataTypes.ENUM('superAdmin', 'broker', 'developer', 'user'),
        allowNull: true,
        defaultValue: 'user',
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
    },
    otp: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    refreshToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    accessToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    tableName: 'users',
    timestamps: true,
});

export default User;
