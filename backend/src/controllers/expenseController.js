import asyncHandler from 'express-async-handler';
import Expense from "../models/expenses.js";
import {Parser} from 'json2csv';


// @desc    Get all expenses(with optional monthly/year filters)
export const getExpenses = asyncHandler (async (req, res) => {
    const {month, year, category, type} = req.query;
    const filters = {userId: req.user._id};

    if (month && year) {
        filters.date = {
            $gte: new Date(year, month - 1, 1),
            $lt: new Date(year, month, 1)   
        };
    } 
    if (category) {
        filters.category = category;
    }
    if (type) {
        filters.type = type;
    }
    const expenses = await Expense.find(filters).sort({date: -1});
    res.json(expenses);      
})

//@desc    Create new expense
export const createExpense = asyncHandler (async (req, res) => {
    const { title, amount, category, date, type, description} = req.body;
    const expense = await Expense.create({
        userId: req.user._id,
        title,
        amount,
        category,
        date,
        type,
        description
    });
    res.status(201).json(expense);
})

//@put update expense
export const updateExpense = asyncHandler (async (req, res) => {
    const expense = await Expense.findOne({_id: req.params.id, userId: req.user._id});
    if (!expense) {
        res.status(404);
        throw new Error('Expense not found');
    }
    if (expense.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }
    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedExpense);

})     

//@delete delete expense
export const deleteExpense = asyncHandler (async (req, res) => {
    const expense = await Expense.findOne({_id: req.params.id, userId: req.user._id});
    if (!expense) {
        res.status(404);
        throw new Error('Expense not found');
    }
    if (expense.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
})

//@Get monthly summary
export const getMonthlySummary = asyncHandler (async (req, res)=> {
    const summary = await Expense.aggregate([
        { $match: { userId: req.user._id } },
        { $group: {
            _id: { month: { $month: "$date" }, year: { $year: "$date" }, type: "$type" },
            total: { $sum: "$amount" }
        }},
        { $sort: { "_id.year": -1, "_id.month": -1 } }
    ])
    res.json(summary);
})

//@Get category breakdown
export const getCategoryBreakdown = asyncHandler (async (req, res)=> {
    const breakdown = await Expense.aggregate([
        { $match: { userId: req.user._id , type: "expense" } },
        { $group: {
            _id: "$category",
            total: { $sum: "$amount" }
        }},
        { $sort: { total: -1 } }
    ])
    res.json(breakdown);
})

//@Get export expenses as CSV
export const exportExpensesCSV = asyncHandler (async (req, res)=> {
    const expenses = await Expense.find({userId: req.user._id}).sort({date: -1});

    const fields = ['title', 'amount', 'category', 'date', 'type', 'description'];
    const parser = new Parser({ fields });
    const csv = parser.parse(expenses);

    res.header('Content-Type', 'text/csv');
    res.attachment('expenses.csv');
    return res.send(csv);
})