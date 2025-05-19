import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Tenant = sequelize.define('Tenant', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    schema: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive',),
        defaultValue: 'active',
    },
}, {
    tableName: 'tenants',
    timestamps: true,
});

export default Tenant;