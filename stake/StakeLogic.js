// stake/StakePage.js
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../loginsystem/AuthProvider";
import toast from "react-hot-toast";

const BSC_RPC_URL = "https://bsc-dataseed.binance.org/";
const STAKE_CONTRACT_ADDRESS = "0x111111125421ca6dc749f19eac7e80b0e9d15c15"; // 1inch Staking
const ADMIN_STAKE_FEE_WALLET = process.env.NEXT_PUBLIC_ADMIN_STAKE_WALLET;

export default function StakePage() {
    const { user } = useAuth();
    const [amount, setAmount] = useState("");
    const [stakedAmount, setStakedAmount] = useState(0);
    const [stakingRewards, setStakingRewards] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) fetchStakingInfo();
    }, [user]);

    const fetchStakingInfo = async () => {
        const { data, error } = await supabase
            .from("users")
            .select("staked_balance, staking_rewards")
            .eq("id", user.id)
            .single();

        if (data) {
            setStakedAmount(data.staked_balance || 0);
            setStakingRewards(data.staking_rewards || 0);
        }
    };

    const stakeTokens = async () => {
        if (!user) return toast.error("You must be logged in!");

        setLoading(true);
        try {
            const provider = new ethers.providers.JsonRpcProvider(BSC_RPC_URL);
            const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);

            const stakeFee = (parseFloat(amount) * 0.03).toFixed(4);
            const finalAmount = (parseFloat(amount) - parseFloat(stakeFee)).toFixed(4);

            const tx1 = await signer.sendTransaction({
                to: ADMIN_STAKE_FEE_WALLET,
                value: ethers.utils.parseEther(stakeFee),
            });

            const tx2 = await signer.sendTransaction({
                to: STAKE_CONTRACT_ADDRESS,
                value: ethers.utils.parseEther(finalAmount),
            });

            await tx1.wait();
            await tx2.wait();

            toast.success(`Staked ${finalAmount} BNB! (3% fee: ${stakeFee} BNB)`);

            await supabase.from("users").update({
                staked_balance: stakedAmount + parseFloat(finalAmount),
            }).eq("id", user.id);

            fetchStakingInfo();
        } catch (error) {
            console.error("Staking failed:", error);
            toast.error("Staking failed.");
        }
        setLoading(false);
    };

    const unstakeTokens = async () => {
        if (!user || stakedAmount <= 0) return toast.error("Nothing to unstake!");

        setLoading(true);
        try {
            const provider = new ethers.providers.JsonRpcProvider(BSC_RPC_URL);
            const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);

            const unstakeFee = (stakedAmount * 0.03).toFixed(4);
            const finalUnstakeAmount = (stakedAmount - unstakeFee).toFixed(4);

            const tx1 = await signer.sendTransaction({
                to: ADMIN_STAKE_FEE_WALLET,
                value: ethers.utils.parseEther(unstakeFee),
            });

            const tx2 = await signer.sendTransaction({
                to: user.wallet,
                value: ethers.utils.parseEther(finalUnstakeAmount),
            });

            await tx1.wait();
            await tx2.wait();

            toast.success(`Unstaked ${finalUnstakeAmount} BNB! (3% fee: ${unstakeFee} BNB)`);

            await supabase.from("users").update({
                staked_balance: 0,
                staking_rewards: 0,
            }).eq("id", user.id);

            fetchStakingInfo();
        } catch (error) {
            console.error("Unstaking failed:", error);
            toast.error("Unstaking failed.");
        }
        setLoading(false);
    };

    return (
        <div className="stake-container">
            <h3>💎 Stake BNB</h3>
            <p>Staked Amount: {stakedAmount} BNB</p>
            <p>Rewards: {stakingRewards} BNB</p>
            <input type="number" placeholder="Amount BNB" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button onClick={stakeTokens} disabled={loading || amount <= 0}>
                {loading ? "Staking..." : "Stake"}
            </button>
            <button onClick={unstakeTokens} disabled={loading || stakedAmount <= 0}>
                {loading ? "Unstaking..." : "Unstake"}
            </button>
        </div>
    );
}
