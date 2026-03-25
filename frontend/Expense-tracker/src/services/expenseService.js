import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
})

//Auto attach JWT token to every request
API.interceptors.request.use((config) => {
    const auth = localStorage.getItem('expensio_auth');
    if (auth) {
        const { token } = JSON.parse(auth);
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
});

//------Auth
export const registerUser = (data) => API.post('api/auth/register', data);
export const loginUser = (credentials) => API.post('api/auth/login', credentials);
export const getProfile = () => API.get('api/auth/profile');

//------Expenses
export const getExpenses = () => API.get('api/expenses');
export const createExpense = (expenseData) => API.post('api/expenses', expenseData);
export const updateExpense = (id, expenseData) => API.put(`api/expenses/${id}`, expenseData);
export const deleteExpense = (id) => API.delete(`api/expenses/${id}`);

//-----Summary
export const getMonthlySummary = () => API.get('api/expenses/summary/monthly');
export const getCategoryBreakdown = () => API.get('api/expenses/summary/category');

//csv export
export const exportCSV = async () => {
    const auth = JSON.parse(localStorage.getItem('expensio_auth') || '{}');
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const res = await fetch(`${baseURL}/api/expenses/export/csv`, {
        headers: {
            Authorization: `Bearer ${auth.token}`,
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok) throw new Error('Failed to export CSV');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
    URL.revokeObjectURL(url);
}

export default  API;