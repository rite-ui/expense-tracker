import { useState, useEffect,useCallback} from "react";
import {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    getCategoryBreakdown,
    getMonthlySummary} from "../services/expenseService.js";

 export const useExpenses = () => {

const [expenses,setExpenses] = useState([])
const [summary,setSummary] = useState([])
const [breakdown,setBreakdown] = useState([])
const [loading,setLoading] = useState([])
const [error,setError] = useState([])


const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
        const [e,s,b] = await Promise.all([
            getExpenses(),
            getCategoryBreakdown(),
            getMonthlySummary()
        ]);
        setExpenses(e.data);
        setBreakdown(s.data);
        setSummary(b.data);
    } catch (err) {
        setError(err.response?.data?.message || err.message || 'An error occurred while loading expenses.');
    } finally {
        setLoading(false);

    }
},[]);

useEffect(()=> {load()},[load]);

const addExpense = async (data) => {await createExpense(data); await load();};
const editExpense = async (id, data) => {await updateExpense(id, data); await load();};
const removeExpense = async (id) => {await deleteExpense(id); await load();};

const totalIncome = expenses.filter(e => e.type =='income').reduce((s,e)=>s + e.amount,0);
const totalExpense = expenses.filter(e=> e.type == 'expense').reduce((s, e)=> s + e.amount,0);
const balance = totalIncome - totalExpense;

return {
    expenses,
    summary,
    breakdown,
    loading,
    error,
    addExpense,
    editExpense,
    removeExpense,
    totalIncome,
    totalExpense,
    balance,
    reload: load
}
};
