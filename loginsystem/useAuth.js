import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (data?.session) {
                setUser(data.session.user);
                fetchWallet(data.session.user.id);
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    const fetchWallet = async (userId) => {
        const { data, error } = await supabase
            .from("users")
            .select("wallet_address")
            .eq("id", userId)
            .single();

        if (data) setWallet(data.wallet_address);
    };

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) return { success: false, error: error.message };

        setUser(data.user);
        fetchWallet(data.user.id);
        return { success: true };
    };

    const register = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) return { success: false, error: error.message };

        // Po registracijos automatiškai priskiria BSC wallet'ą
        await assignWalletToUser(data.user.id);

        setUser(data.user);
        fetchWallet(data.user.id);
        return { success: true };
    };

    const assignWalletToUser = async (userId) => {
        const generatedWallet = generateBscWallet();
        await supabase.from("users").upsert({
            id: userId,
            wallet_address: generatedWallet,
        });
        setWallet(generatedWallet);
    };

    const generateBscWallet = () => {
        return "0x" + Math.random().toString(36).substr(2, 40).toUpperCase(); // Dummy BSC wallet generator (vėliau pakeisti į tikrą generaciją)
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setWallet(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, wallet, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
