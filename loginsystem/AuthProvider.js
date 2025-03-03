// loginsystem/AuthProvider.js
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { ethers } from "ethers";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useRouter } from "next/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();

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

        if (data) {
            setWallet(data.wallet_address);
            fetchBalance(data.wallet_address);
        }
    };

    const fetchBalance = async (walletAddress) => {
        if (!walletAddress) return;
        try {
            const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
            const balanceWei = await provider.getBalance(walletAddress);
            const balanceBNB = ethers.utils.formatEther(balanceWei);
            setBalance(balanceBNB);
        } catch (error) {
            console.error("Failed to fetch balance:", error);
        }
    };

    // ✅ Email prisijungimas
    const loginWithEmail = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { success: false, error: error.message };

        setUser(data.user);
        fetchWallet(data.user.id);
        return { success: true };
    };

    // ✅ Email registracija + automatinis BSC wallet
    const registerWithEmail = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) return { success: false, error: error.message };

        const newWallet = generateBscWallet();
        await supabase.from("users").upsert({
            id: data.user.id,
            wallet_address: newWallet.address,
            private_key: newWallet.privateKey,
        });

        setUser(data.user);
        setWallet(newWallet.address);
        fetchBalance(newWallet.address);

        return { success: true };
    };

    // ✅ WalletConnect prisijungimas
    const loginWithWallet = async () => {
        try {
            if (!connectors[0]) throw new Error("No wallet connector available");
            await connect({ connector: connectors[0] });

            if (address) {
                const { data } = await supabase
                    .from("users")
                    .select("id")
                    .eq("wallet_address", address)
                    .single();

                if (data) {
                    // Vartotojas jau yra DB, priskiriam jam user info
                    setUser(data);
                } else {
                    // Naujas vartotojas, saugom į DB
                    await supabase.from("users").insert({ wallet_address: address });
                }

                setWallet(address);
                fetchBalance(address);
                return { success: true };
            }
        } catch (error) {
            console.error("Wallet login failed:", error);
            return { success: false, error: error.message };
        }
    };

    // ✅ Atsijungimas
    const logout = async () => {
        await supabase.auth.signOut();
        disconnect();
        setUser(null);
        setWallet(null);
        setBalance(0);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{
            user,
            wallet,
            balance,
            loginWithEmail,
            registerWithEmail,
            loginWithWallet,
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

// ✅ Tikras BSC Wallet generavimas
const generateBscWallet = () => {
    const wallet = ethers.Wallet.createRandom();
    return { address: wallet.address, privateKey: wallet.privateKey };
};
