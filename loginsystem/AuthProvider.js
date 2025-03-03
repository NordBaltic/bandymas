import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useBscWallet } from "./useBscWallet";
import { useRouter } from "next/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const { wallet, generateAndStoreWallet } = useBscWallet();
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getSession();
            if (data?.session) {
                setUser(data.session.user);
                generateAndStoreWallet(data.session.user.id);
            } else {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) return { success: false, error: error.message };

        setUser(data.user);
        generateAndStoreWallet(data.user.id);
        return { success: true };
    };

    const register = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) return { success: false, error: error.message };

        setUser(data.user);
        generateAndStoreWallet(data.user.id);
        return { success: true };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, wallet, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
