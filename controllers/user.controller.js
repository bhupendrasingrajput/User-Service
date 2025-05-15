import { User } from '../models/index.model.js';
import { ApiError } from '../utils/ApiError.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const createUser = async (req, res, next) => {
    try {
        const { name, email, phone, role, password } = req.body;

        if (!name || !email || !phone || !password) throw new ApiError(400, 'name, email, phone, and password are required');

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) throw new ApiError(409, 'User already exists');

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, phone, role, password: hashedPassword, });

        const payload = { id: user.id, email: user.email, role: user.role };

        const accessToken = jwt.sign(payload, config.jwt.secret, { expiresIn: '7d' });
        const refreshToken = jwt.sign(payload, config.jwt.secret, { expiresIn: '30d' });

        user.accessToken = accessToken;
        user.refreshToken = refreshToken;

        await user.save();

        const userData = user.toJSON();
        delete userData.password;
        delete userData.otp;
        delete userData.refreshToken;
        delete userData.accessToken;

        return res.status(201).json({
            status: 'success',
            user: userData,
            tokens: {
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
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

        if (!email) throw new ApiError(400, 'Email is required');

        const user = await User.findOne({
            where: { email },
            attributes: { exclude: ['password', 'otp', 'refreshToken', 'accessToken', 'createdAt', 'updatedAt'] }
        });

        if (!user) throw new ApiError(404, 'User not found');

        return res.status(200).json({
            status: 'success',
            user: user
        });
    } catch (error) {
        next(error);
    }
};