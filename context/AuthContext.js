import React, { createContext, useContext, useState } from 'react';
import { loginWithEmail, registerWithEmail } from '../lib/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        const result = await loginWithEmail(email, password);
        if (result.success) {
            setUser(result.user);
        }
    };

    const register = async (email, password) => {
        const result = await registerWithEmail(email, password);
        if (result.success) {
            setUser(result.user);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
