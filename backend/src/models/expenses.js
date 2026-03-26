import mongoose from "mongoose";

 const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: [true, "Title is required"],
        trim : true,
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min : [0, "Amount must be a positive number"],
    },
    type: {
        type: String,
        required:true,
        enum : ["expense", "income"],
    },
    category: {
        type: String,
        enum : ["Food", "Transport", "Shopping","Bills", "Entertainment","Salary", "Utilities", "Health", "Other"],
        required:true,
        trim : true,
        default: "General",
    },
    date: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
        trim : true,
    }
    
 },{timestamps: true});

export default mongoose.model('Expense', expenseSchema);