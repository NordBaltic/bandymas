// context/AuthProvider.js
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const session = supabase.auth.session();
        setUser(session?.user ?? null);

        supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null);
        });
    }, []);

    const loginWithEmail = async (email, password) => {
        const { user, error } = await supabase.auth.signIn({
            email,
            password,
        });

        if (error) throw new Error(error.message);
        return user;
    };

    const registerWithEmail = async (email, password) => {
        const { user, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) throw new Error(error.message);
        return user;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loginWithEmail,
                registerWithEmail,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
