import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginWithEmail, registerWithEmail, signOut } from '../lib/auth';
import { ethers } from 'ethers';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            const { data: session } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
                const { data: walletData } = await supabase
                    .from('wallets')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .single();
                if (walletData) {
                    setWallet(walletData.wallet_address);
                }
            }
            setLoading(false);
        }
        fetchUser();
    }, []);

    const createWallet = async (userId) => {
        const wallet = ethers.Wallet.createRandom();
        const walletAddress = wallet.address;
        const encryptedPrivateKey = btoa(wallet.privateKey); // Šifruotas privatus raktas (saugomas lokaliai)
        localStorage.setItem('bsc_private_key', encryptedPrivateKey);

        await supabase.from('wallets').insert({ user_id: userId, wallet_address: walletAddress });
        return walletAddress;
    };

    const register = async (email, password) => {
        const result = await registerWithEmail(email, password);
        if (result.success) {
            setUser(result.user);
            const walletAddress = await createWallet(result.user.id);
            setWallet(walletAddress);
        }
    };

    const login = async (email, password) => {
        const result = await loginWithEmail(email, password);
        if (result.success) {
            setUser(result.user);
            const { data: walletData } = await supabase
                .from('wallets')
                .select('*')
                .eq('user_id', result.user.id)
                .single();
            if (walletData) {
                setWallet(walletData.wallet_address);
            }
        }
    };

    const logout = async () => {
        await signOut();
        setUser(null);
        setWallet(null);
        localStorage.removeItem('bsc_private_key');
    };

    return (
        <AuthContext.Provider value={{ user, wallet, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

