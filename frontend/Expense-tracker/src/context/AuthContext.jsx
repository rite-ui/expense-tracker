import { createContext, useState } from 'react';
import { registerUser, loginUser } from '../services/expenseService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('expensio_auth')) || null;
        } catch {
            return null;
        }
    });

    const [loading, setLoading] = useState(false);

    // 🔐 Register
    const register = async ({name, email, password}) => {
        try {
            setLoading(true);
            const { data } = await registerUser(name, email, password);

            if (!data) throw new Error("No data received");

            localStorage.setItem('expensio_auth', JSON.stringify(data));
            setAuth(data);
        } catch (error) {
            console.error("Register Error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    // 🔐 Login
    const login = async ({email, password}) => {
        try {
            setLoading(true);
            const { data } = await loginUser({email, password});

            if (!data) throw new Error("Invalid credentials");

            localStorage.setItem('expensio_auth', JSON.stringify(data));
            setAuth(data);
        } catch (error) {
            console.error("Login Error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    // 🚪 Logout
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


