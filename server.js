import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import errorHandler from './middlewares/errorHandler.js';
import config from './config/index.js';

const app = express();

// Middleware Setup
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Health Check Endpoint
app.get('/', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'User Service is running.', timestamp: new Date().toLocaleDateString() });
});

// Global Error Handler
app.use(errorHandler);

// Server Startup
const PORT = config.port;

app.listen(PORT, () => {
    console.log(`🚀 User Service is running on port ${PORT}`);
});
