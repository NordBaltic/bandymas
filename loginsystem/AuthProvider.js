// loginsystem/AuthProvider.js
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { ethers } from "ethers";
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

    // ✅ Funkcija prisijungimui su email
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

    // ✅ Funkcija registracijai su email (priskiria BSC piniginę)
    const register = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) return { success: false, error: error.message };

        await assignWalletToUser(data.user.id);
        setUser(data.user);
        fetchWallet(data.user.id);
        return { success: true };
    };

    // ✅ Funkcija atsijungimui
    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setWallet(null);
        router.push("/login");
    };

    // ✅ Gauti vartotojo BSC piniginę iš DB
    const fetchWallet = async (userId) => {
        const { data, error } = await supabase
            .from("users")
            .select("wallet_address")
            .eq("id", userId)
            .single();

        if (data) setWallet(data.wallet_address);
    };

    // ✅ Automatinis BSC piniginės priskyrimas naujam vartotojui
    const assignWalletToUser = async (userId) => {
        const generatedWallet = generateBscWallet();
        await supabase.from("users").upsert({
            id: userId,
            wallet_address: generatedWallet.address,
            private_key: generatedWallet.privateKey, // Išsaugoma duomenų bazėje
        });
        setWallet(generatedWallet.address);
    };

    // ✅ Tikras BSC wallet generatorius (ne fake)
    const generateBscWallet = () => {
        const wallet = ethers.Wallet.createRandom();
        return {
            address: wallet.address,
            privateKey: wallet.privateKey,
        };
    };

    return (
        <AuthContext.Provider value={{ user, wallet, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
