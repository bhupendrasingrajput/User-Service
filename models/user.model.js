import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING(20),
        unique: true,
    },
    isSuperAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'blocked'),
        defaultValue: 'active',
    },
    otp: DataTypes.STRING,
    password: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    accessToken: DataTypes.STRING,
}, {
    tableName: 'users',
    timestamps: true,
});


export default User;