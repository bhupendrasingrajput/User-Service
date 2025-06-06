import './utils/loadVariables.js';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectToDatabase } from './config/database.js';
import config from './config/index.js';
import errorHandler from './middlewares/errorHandler.js';
import globalRoutes from './routes/index.routes.js';

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

app.use('/', globalRoutes);

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
