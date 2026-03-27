import { createContext, useState } from 'react';
import { registerUser, loginUser } from '../services/expenseService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        try {
            // LocalStorage se data uthayein agar exist karta hai
            return JSON.parse(localStorage.getItem('expensio_auth')) || null;
        } catch {
            return null;
        }
    });

    const [loading, setLoading] = useState(false);

    // 🔐 Register Logic
    const register = async ({name, email, password}) => {
        try {
            setLoading(true);
            // Backend username expect kar raha hai
            const { data } = await registerUser({username: name, email, password});

            if (!data?.token) throw new Error("No token received");

            // ✅ Backend response: { _id, username, email, token }
            const authData = { 
                token: data.token, 
                name: data.username, // Sidebar ke liye username ko name map kiya
                email: data.email,
                _id: data._id
            };

            localStorage.setItem('expensio_auth', JSON.stringify(authData));
            setAuth(authData);
        } catch (error) {
            console.error("Register Error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    // 🔐 Login Logic
    const login = async ({email, password}) => {
        try {
            setLoading(true);
            const { data } = await loginUser({email, password});

            if (!data?.token) throw new Error("No token received");

            // ✅ Backend data ko correctly format karke state mein save karein
            const authData = { 
                token: data.token, 
                name: data.username, 
                email: data.email,
                _id: data._id
            };

            localStorage.setItem('expensio_auth', JSON.stringify(authData));
            setAuth(authData);
        } catch (error) {
            console.error("Login Error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    // 🚪 Logout Logic
    const logout = () => {
        localStorage.removeItem('expensio_auth');
        setAuth(null);
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;