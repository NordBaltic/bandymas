import { useState, useEffect } from "react";
import { useAuth } from "../loginsystem/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import { ethers } from "ethers";
import "../styles/stake.css";

const STAKE_CONTRACT = process.env.NEXT_PUBLIC_STAKE_CONTRACT;
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
        const { data } = await supabase.from("staking").select("staked_amount").eq("wallet", wallet).single();
        setStakedBalance(data?.staked_amount || "0.00");
    };

    const stakeBNB = async () => {
        if (!wallet || !amount || parseFloat(amount) <= 0) return;
        setLoading(true);
        try {
            const provider = new ethers.providers.JsonRpcProvider(BSC_RPC);
            const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);

            const tx = await signer.sendTransaction({
                to: STAKE_CONTRACT,
                value: ethers.utils.parseEther(amount),
            });

            await tx.wait();
            await supabase.from("staking").upsert({ wallet, staked_amount: amount });
            fetchStakedBalance();
        } catch (error) {
            console.error("Staking error:", error);
        }
        setLoading(false);
    };

    return (
        <div className="stake-container">
            <h1>🔥 Staking</h1>
            <p>💰 Staked: {stakedBalance} BNB</p>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button onClick={stakeBNB} disabled={loading}>{loading ? "Processing..." : "Stake"}</button>
        </div>
    );
}
