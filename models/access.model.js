import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Access = sequelize.define('Access', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    service: {
        type: DataTypes.ENUM('portal', 'dashboard', 'crm', 'hrms'),
        allowNull: false,
    },
    tenantId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'tenants',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'access',
    timestamps: true,
    indexes: [
        { fields: ['userId'] },
        { fields: ['tenantId'] },
        { fields: ['service'] },
        { fields: ['userId', 'service'] }
    ]
});

export default Access;