import dotenv from 'dotenv';
dotenv.config();


import expess from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from  './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import {errorHandler} from './middleware/errorMiddleware.js';

// CONFIG
dotenv.config();

// APP CONFIG

const app = expess();

// MIDDLEWARE
app.use(cors({
    origin: 'expense-tracker-woad-pi.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(expess.json());

// DB CONFIG
connectDB();



// API ENDPOINTS
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use(errorHandler); // Error handling middleware

// LISTENER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on  http://localhost:${PORT}`));