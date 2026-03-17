import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    getMonthlySummary,
    getCategoryBreakdown,
    exportExpensesCSV
} from  '../controllers/expenseController.js';

const router = express.Router();

// Get all expenses for the authenticated user
router.use(protect); //all routes below are protected

router.route('/')
    .get(getExpenses) // Get all expenses
    .post(createExpense); // Create a new expense

router.route('/:id')
    
    .put(updateExpense) // Update an expense
    .delete(deleteExpense); // Delete an expense

// Get monthly summary of expenses
router.get('/summary/monthly', getMonthlySummary);

// Get category breakdown of expenses
router.get('/summary/categories', getCategoryBreakdown);

// Export expenses as CSV
router.get('/export/csv', exportExpensesCSV);


export default router