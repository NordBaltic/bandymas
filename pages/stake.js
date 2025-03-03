import React, { useState, useEffect } from "react";
import { useAuth } from "../loginsystem/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import "../styles/Stake.css";

const STAKE_CONTRACT = "0x8c540F6C0f8a43B6A3C89aCE9D6FcD93C9c55AD5"; 
const ADMIN_WALLET = process.env.NEXT_PUBLIC_STAKE_ADMIN_WALLET;
const BSC_RPC = "https://bsc-dataseed.binance.org/";

export default function Stake() {
    const { wallet } = useAuth();
    const [amount, setAmount] = useState("");
    const [stakedBalance, setStakedBalance] = useState("0.00");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (wallet) fetchStakedBalance();
    }, [wallet]);

    const fetchStakedBalance = async () => {
        try {
            const { data, error } = await supabase
                .from("staking")
                .select("staked_amount")
                .eq("wallet", wallet)
                .single();
            if (error) throw error;
            setStakedBalance(data?.staked_amount || "0.00");
        } catch (error) {
            console.error("❌ Error fetching staking balance:", error);
        }
    };

    return (
        <div className="stake-container fade-in">
            <h1 className="stake-title">🔥 Staking Platform</h1>
            <p className="staked-balance glass-morph">💰 Staked: {stakedBalance} BNB</p>

            <input
                type="number"
                placeholder="Enter BNB amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="stake-input"
            />
        </div>
    );
}
