import expess from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';

// CONFIG
dotenv.config();

// APP CONFIG

const app = expess();

// MIDDLEWARE
app.use(cors());
app.use(expess.json());

// DB CONFIG
connectDB();



// API ENDPOINTS
app.get('/', (req, res) => {
    res.status(200).send('Hello World');
});

// LISTENER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on  http://localhost:${PORT}`));