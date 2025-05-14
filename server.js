import './utils/loadVariables.js';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import errorHandler from './middlewares/errorHandler.js';
import { connectToDatabase } from './config/database.js';
import config from './config/index.js';
import User from './models/user.model.js'

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
}));

app.use(helmet());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'User Service is running.', timestamp: new Date().toISOString() });
});

app.get('/find-by-email', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error in /find-by-email:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.use(errorHandler);

const PORT = config.port;

(async () => {
    try {
        await connectToDatabase();

        app.listen(PORT, () => {
            console.log(`🚀 User service started on port ${PORT}`);
        });

    } catch (error) {
        console.error('🐞 Failed to start server due to database error.', error);
        process.exit(1);
    }
})();
