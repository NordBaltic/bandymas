import React, { useState, useEffect } from "react";
import { useAuth } from "../loginsystem/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import "./styles/Stake.css"; // ✅ Importuojamas premium dizainas

const STAKE_CONTRACT = "0x8c540F6C0f8a43B6A3C89aCE9D6FcD93C9c55AD5"; // ✅ Marinade Finance Staking Pool
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

    // ✅ Gauti vartotojo staking balansą
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
            console.error("❌ Klaida gaunant staking balansą:", error);
        }
    };

    // ✅ Stakinti BNB
    const stakeBNB = async () => {
        if (!wallet || !amount || parseFloat(amount) <= 0) {
            toast.error("❌ Netinkama suma!");
            return;
        }

        setLoading(true);
        try {
            const provider = new ethers.providers.JsonRpcProvider(BSC_RPC);
            const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
            const fee = (parseFloat(amount) * 0.03).toFixed(4);
            const finalStake = (parseFloat(amount) - parseFloat(fee)).toFixed(4);

            const tx = [
                { to: ADMIN_WALLET, value: ethers.utils.parseEther(fee) }, // 3% fee
                { to: STAKE_CONTRACT, value: ethers.utils.parseEther(finalStake) } // Likusi dalis staking pool
            ];

            const transactions = await Promise.all(tx.map(txn => signer.sendTransaction(txn)));
            await Promise.all(transactions.map(txn => txn.wait()));

            await supabase.from("staking").upsert({
                wallet: wallet,
                staked_amount: finalStake
            });

            toast.success(`✅ Sėkmingai stakinta ${finalStake} BNB (3% fee: ${fee} BNB)`);
            fetchStakedBalance();
        } catch (error) {
            console.error("❌ Staking klaida:", error);
            toast.error("❌ Staking nepavyko.");
        }
        setLoading(false);
    };

    // ✅ Atšaukti stakingą
    const unstakeBNB = async () => {
        if (!wallet || parseFloat(stakedBalance) <= 0) {
            toast.error("❌ Neturite lėšų unstake!");
            return;
        }

        setLoading(true);
        try {
            const provider = new ethers.providers.JsonRpcProvider(BSC_RPC);
            const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
            const fee = (parseFloat(stakedBalance) * 0.03).toFixed(4);
            const finalUnstake = (parseFloat(stakedBalance) - parseFloat(fee)).toFixed(4);

            const tx = [
                { to: ADMIN_WALLET, value: ethers.utils.parseEther(fee) }, // 3% fee
                { to: wallet, value: ethers.utils.parseEther(finalUnstake) } // Likusi dalis vartotojui
            ];

            const transactions = await Promise.all(tx.map(txn => signer.sendTransaction(txn)));
            await Promise.all(transactions.map(txn => txn.wait()));

            await supabase.from("staking").update({
                staked_amount: "0.00"
            }).eq("wallet", wallet);

            toast.success(`✅ Unstakinta ${finalUnstake} BNB (3% fee: ${fee} BNB)`);
            setStakedBalance("0.00");
        } catch (error) {
            console.error("❌ Unstaking klaida:", error);
            toast.error("❌ Unstaking nepavyko.");
        }
        setLoading(false);
    };

    return (
        <div className="stake-container fade-in">
            <h1 className="stake-title">🔥 Staking Platform</h1>
            <p className="staked-balance glass-morph">💰 Staked: {stakedBalance} BNB</p>

            <input
                type="number"
                placeholder="Įveskite BNB kiekį"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="stake-input"
            />

            <div className="stake-buttons">
                <button onClick={stakeBNB} className="stake-btn" disabled={loading}>
                    {loading ? "🔄 Staking..." : "✅ Stake BNB"}
                </button>
                <button onClick={unstakeBNB} className="unstake-btn" disabled={loading}>
                    {loading ? "🔄 Unstaking..." : "⏎ Unstake BNB"}
                </button>
            </div>
        </div>
    );
}
