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
        required: true,
        enum : ["expense", "income"],
    },
    category: {
        type: String,
        required: true,
        trim : true,
        // ✅ Sabhi nayi categories ko yahan add kar diya gaya hai
        enum : [
            "Salary", "Freelance", "Investments", "Rental", "Gift", // Income cats
            "Food", "Transport", "Shopping", "Bills", "Health", "Entertainment", "Other", "Utilities" // Expense cats
        ],
        default: "Other", // "General" ki jagah "Other" rakha hai jo list mein hai
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