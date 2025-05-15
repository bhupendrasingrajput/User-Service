import express from 'express';
import userRoutes from './user.routes.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        pid: process.pid,
        status: 'active',
        message: 'User Service is running!',
        timestamp: new Date().toISOString()
    });
});

router.use('/user', userRoutes);

export default router;
