import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { supabase } from '../config/supabaseClient';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import '../styles/BscBalance.css'; // ✅ Importuojam CSS failą

const BscBalance = () => {
    const { address, isConnected } = useAccount();
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isConnected || !address) return;

        const fetchBalance = async () => {
            try {
                setLoading(true);
                
                // Prisijungiam prie BSC tinklo
                const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
                
                // Gaunam balansą
                const rawBalance = await provider.getBalance(address);
                const formattedBalance = ethers.utils.formatEther(rawBalance);
                setBalance(parseFloat(formattedBalance).toFixed(4));

                // Saugojam balansą į duomenų bazę
                await supabase
                    .from('wallet_balances')
                    .upsert([{ user_address: address, balance: formattedBalance }], { onConflict: ['user_address'] });

            } catch (error) {
                console.error("🔴 Klaida gaunant balansą:", error);
                setBalance(null);
            } finally {
                setLoading(false);
            }
        };

        fetchBalance();
    }, [address, isConnected]);

    return (
        <motion.div 
            className="bsc-balance-container glass-morph"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h3 className="bsc-title">BNB Balance</h3>
            {loading ? (
                <div className="loading-animation liquid-gold"></div>
            ) : (
                <p className="bsc-balance">
                    {balance !== null ? `${balance} BNB` : 'Balance not available'}
                </p>
            )}
        </motion.div>
    );
};

export default BscBalance;
