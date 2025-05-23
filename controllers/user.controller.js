import { Access, Tenant, User } from '../models/index.model.js';
import { ApiError } from '../utils/ApiError.js';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

export const createUser = async (req, res, next) => {
    try {
        const { name, email, phone, password, service, tenantId } = req.body;
        // if (!name || !email || !phone || !service) throw new ApiError(400, 'name, email, phone, and service are required');

        const isExists = await User.findOne({
            where: { email },
            attributes: ['id']
        });

        if (isExists) throw new ApiError(409, 'User already exists');

        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

        const user = await User.create({ name, email, phone, password: hashedPassword, });
        const access = await Access.create({ userId: user?.id, service, tenantId });

        const userData = user.toJSON();
        const accessData = access.toJSON();

        return res.status(201).json({
            status: 'success', user: {
                id: userData?.id, name: userData?.name, email: userData?.email, phone: userData?.phone,
                access: { id: accessData?.id, service: accessData?.service, status: accessData?.status }
            }
        });
    } catch (error) {
        next(error);
    }
}

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

        // if (!email) throw new ApiError(400, 'Email is required');

        const user = await User.findOne({
            where: { email },
            attributes: ['id', 'name', 'email', 'phone'],
            include: [
                {
                    model: Access, required: false, attributes: ['id', 'service', 'status'],
                    include: [{ model: Tenant, required: false, attributes: ['id', 'name', 'schema', 'status'] }]
                }
            ]
        });

        // if (!user) throw new ApiError(404, 'User not found');

        return res.status(200).json({
            status: 'success',
            user: user
        });
    } catch (error) {
        next(error);
    }
};