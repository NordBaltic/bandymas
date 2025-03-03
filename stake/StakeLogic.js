// stake/StakeLogic.js
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../loginsystem/AuthProvider";
import toast from "react-hot-toast";

const BSC_RPC_URL = "https://bsc-dataseed.binance.org/";
const STAKE_CONTRACT_ADDRESS = "0x111111125421ca6dc749f19eac7e80b0e9d15c15"; // 1inch Staking Contract
const ADMIN_STAKE_FEE_WALLET = process.env.NEXT_PUBLIC_ADMIN_STAKE_WALLET;

export default function StakeLogic() {
    const { user } = useAuth();
    const [amount, setAmount] = useState("");
    const [stakedAmount, setStakedAmount] = useState(0);
    const [stakingRewards, setStakingRewards] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) fetchStakingInfo();
    }, [user]);

    const fetchStakingInfo = async () => {
        const { data } = await supabase
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
        if (amount <= 0) return toast.error("Invalid stake amount!");

        setLoading(true);
        try {
            const provider = new ethers.providers.JsonRpcProvider(BSC_RPC_URL);
            const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);

            const stakeFee = (parseFloat(amount) * 0.04).toFixed(4); // 4% fee
            const finalAmount = (parseFloat(amount) - parseFloat(stakeFee)).toFixed(4);

            const feeTx = await signer.sendTransaction({
                to: ADMIN_STAKE_FEE_WALLET,
                value: ethers.utils.parseEther(stakeFee),
            });

            const stakeTx = await signer.sendTransaction({
                to: STAKE_CONTRACT_ADDRESS,
                value: ethers.utils.parseEther(finalAmount),
            });

            await feeTx.wait();
            await stakeTx.wait();

            toast.success(`Staked ${finalAmount} BNB! (4% fee: ${stakeFee} BNB)`);

            await supabase.from("users").update({
                staked_balance: stakedAmount + parseFloat(finalAmount),
            }).eq("id", user.id);

            fetchStakingInfo();
        } catch (error) {
            toast.error("Staking failed.");
            console.error("Staking Error:", error);
        }
        setLoading(false);
    };

    const unstakeTokens = async () => {
        if (!user || stakedAmount <= 0) return toast.error("Nothing to unstake!");

        setLoading(true);
        try {
            const provider = new ethers.providers.JsonRpcProvider(BSC_RPC_URL);
            const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);

            const unstakeFee = (stakedAmount * 0.04).toFixed(4); // 4% unstake fee
            const finalUnstakeAmount = (stakedAmount - unstakeFee).toFixed(4);

            const feeTx = await signer.sendTransaction({
                to: ADMIN_STAKE_FEE_WALLET,
                value: ethers.utils.parseEther(unstakeFee),
            });

            const unstakeTx = await signer.sendTransaction({
                to: user.wallet,
                value: ethers.utils.parseEther(finalUnstakeAmount),
            });

            await feeTx.wait();
            await unstakeTx.wait();

            toast.success(`Unstaked ${finalUnstakeAmount} BNB! (4% fee: ${unstakeFee} BNB)`);

            await supabase.from("users").update({
                staked_balance: 0,
                staking_rewards: 0,
            }).eq("id", user.id);

            fetchStakingInfo();
        } catch (error) {
            toast.error("Unstaking failed.");
            console.error("Unstaking Error:", error);
        }
        setLoading(false);
    };

    return {
        amount,
        setAmount,
        stakedAmount,
        stakingRewards,
        loading,
        stakeTokens,
        unstakeTokens,
    };
}
