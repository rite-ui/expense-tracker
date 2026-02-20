import mongoose from "mongoose";

 const expenseSchema = new mongoose.Schema({
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
    category: {
        type: String,
        required:true,
        trim : true,
        default: "General",
    },
    date: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
 },{timestamps: true});

export default mongoose.model('Expense', expenseSchema);