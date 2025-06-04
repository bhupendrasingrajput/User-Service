import bcrypt from 'bcryptjs';
import { Access, Tenant, User } from '../models/index.model.js';
import { ApiError } from '../utils/ApiError.js';
import sequelize from "../config/database.js";

export const createUser = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { name, email, phone, password, service, tenantId } = req.body;

        const isExists = await User.findOne({
            where: { email },
            attributes: ['id'],
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        if (isExists) {
            await t.rollback();
            throw new ApiError(409, 'User already exists');
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword
        }, { transaction: t });

        const access = await Access.create({
            userId: user.id,
            service,
            tenantId
        }, { transaction: t });

        await t.commit();

        return res.status(201).json({
            status: 'success',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                access: {
                    id: access.id,
                    service: access.service,
                    status: access.status
                }
            }
        });

    } catch (error) {
        await t.rollback();
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password', 'otp', 'refreshToken', 'accessToken', 'updatedAt'] }
        });
        return res.status(200).json({
            status: 'success',
            users
        });
    } catch (error) {
        next(error);
    }
};

export const getUserByEmail = async (req, res, next) => {
    try {
        const { email } = req.params;

        const userInstance = await User.findOne({
            where: { email },
            attributes: ['id', 'name', 'email', 'phone', 'password', 'isSuperAdmin'],
            include: [
                {
                    model: Access,
                    required: false,
                    attributes: ['id', 'service', 'status'],
                    as: 'accesses',
                    include: [
                        {
                            model: Tenant,
                            required: false,
                            attributes: ['id', 'name', 'schema', 'status']
                        }
                    ]
                }
            ]
        });

        if (!userInstance) {
            throw new ApiError(404, 'User not found');
        }

        const user = userInstance.toJSON();

        const accessesObj = {};
        if (user.accesses && Array.isArray(user.accesses)) {
            user.accesses.forEach(access => {
                const { service, ...details } = access;
                accessesObj[service] = details;
            });
        }
        user.accesses = accessesObj;

        return res.status(200).json({
            status: 'success',
            user
        });
    } catch (error) {
        next(error);
    }
};