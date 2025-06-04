import User from './user.model.js';
import Access from './access.model.js';
import Tenant from './tenant.model.js';

User.hasMany(Access, { foreignKey: 'userId', as: 'accesses' });
Access.belongsTo(User, { foreignKey: 'userId' });

Tenant.hasMany(Access, { foreignKey: 'tenantId' });
Access.belongsTo(Tenant, { foreignKey: 'tenantId' });

export {
    User,
    Access,
    Tenant
};
