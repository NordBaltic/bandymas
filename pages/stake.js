import { useState, useEffect } from "react";
import { useAuth } from "../loginsystem/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import { ethers } from "ethers";
import toast from "react-hot-toast";

const STAKE_CONTRACT = "0x8c540F6C0f8a43B6A3C89aCE9D6FcD93C9c55AD5"; // ✅ Marinade Finance Staking Pool
const ADMIN_WALLET = process.env.NEXT_PUBLIC_STAKE_ADMIN_WALLET; // ✅ Tavo staking fee wallet
const BSC_RPC = "https://bsc-dataseed.binance.org/";

export default function Stake() {
    const { user, wallet } = useAuth();
    const [amount, setAmount] = useState("");
    const [stakedBalance, setStakedBalance] = useState("0.00");

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
            if (data) setStakedBalance(data.staked_amount);
        } catch (error) {
            console.error("Error fetching staked balance:", error);
        }
    };

    const stakeBNB = async () => {
        if (!wallet || !amount || parseFloat(amount) <= 0) {
            toast.error("Invalid amount!");
            return;
        }

        const provider = new ethers.providers.JsonRpcProvider(BSC_RPC);
        const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
        const fee = (parseFloat(amount) * 0.03).toFixed(4);
        const finalStake = (parseFloat(amount) - parseFloat(fee)).toFixed(4);

        const tx = [
            { to: ADMIN_WALLET, value: ethers.utils.parseEther(fee) }, // 3% fee į tavo staking wallet
            { to: STAKE_CONTRACT, value: ethers.utils.parseEther(finalStake) } // Likusi dalis eina į staking pool
        ];

        try {
            const transactions = await Promise.all(tx.map(txn => signer.sendTransaction(txn)));
            await Promise.all(transactions.map(txn => txn.wait()));

            await supabase.from("staking").upsert({
                wallet: wallet,
                staked_amount: finalStake
            });

            toast.success(`Staked ${finalStake} BNB (3% fee: ${fee} BNB)`);
            fetchStakedBalance();
        } catch (error) {
            console.error("Staking error:", error);
            toast.error("Staking failed.");
        }
    };

    const unstakeBNB = async () => {
        if (!wallet || parseFloat(stakedBalance) <= 0) {
            toast.error("No balance to unstake!");
            return;
        }

        const provider = new ethers.providers.JsonRpcProvider(BSC_RPC);
        const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
        const unstakeAmount = stakedBalance;
        const fee = (parseFloat(unstakeAmount) * 0.03).toFixed(4);
        const finalUnstake = (parseFloat(unstakeAmount) - parseFloat(fee)).toFixed(4);

        const tx = [
            { to: ADMIN_WALLET, value: ethers.utils.parseEther(fee) }, // 3% fee į tavo staking wallet
            { to: wallet, value: ethers.utils.parseEther(finalUnstake) } // Likusi dalis grąžinama vartotojui
        ];

        try {
            const transactions = await Promise.all(tx.map(txn => signer.sendTransaction(txn)));
            await Promise.all(transactions.map(txn => txn.wait()));

            await supabase.from("staking").update({
                staked_amount: "0.00"
            }).eq("wallet", wallet);

            toast.success(`Unstaked ${finalUnstake} BNB (3% fee: ${fee} BNB)`);
            setStakedBalance("0.00");
        } catch (error) {
            console.error("Unstaking error:", error);
            toast.error("Unstaking failed.");
        }
    };

    return (
        <div className="stake-container">
            <h3>🔥 Stake BNB</h3>
            <p className="staked-balance">Staked Balance: {stakedBalance} BNB</p>
            <input type="text" placeholder="Amount to stake" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button onClick={stakeBNB} className="stake-btn">Stake</button>
            <button onClick={unstakeBNB} className="unstake-btn">Unstake</button>
        </div>
    );
}
