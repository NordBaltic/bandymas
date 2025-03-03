import { useEffect, useState } from "react";
import { useAuth } from "../loginsystem/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import WalletConnectButton from "../components/WalletConnectButton";
import ChartComponent from "../components/ChartComponent";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [balance, setBalance] = useState(0);
    const [stakingRewards, setStakingRewards] = useState(0);
    const [donationTotal, setDonationTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetchData();
    }, [user]);

    const fetchData = async () => {
        setLoading(true);

        // 🔹 Gauti vartotojo balansą
        const { data: walletData } = await supabase
            .from("users")
            .select("wallet")
            .eq("id", user.id)
            .single();

        if (walletData?.wallet) {
            const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
            const balanceWei = await provider.getBalance(walletData.wallet);
            setBalance(ethers.utils.formatEther(balanceWei));
        }

        // 🔹 Gauti staking reward’us
        const { data: stakeData } = await supabase
            .from("staking_rewards")
            .select("amount")
            .eq("user_id", user.id);

        setStakingRewards(stakeData?.reduce((acc, item) => acc + item.amount, 0) || 0);

        // 🔹 Gauti donation sumą
        const { data: donations } = await supabase
            .from("donations")
            .select("amount")
            .eq("user_id", user.id);

        setDonationTotal(donations?.reduce((acc, item) => acc + item.amount, 0) || 0);

        setLoading(false);
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">🚀 Welcome, {user?.email || "User"}!</h1>
            <button onClick={logout} className="dashboard-logout-btn">Logout</button>

            <div className="dashboard-info">
                <div className="balance-box">
                    <h2>Wallet Balance</h2>
                    <p>{loading ? "Loading..." : `${balance} BNB`}</p>
                </div>
                <div className="stake-box">
                    <h2>Staking Rewards</h2>
                    <p>{stakingRewards} BNB</p>
                </div>
                <div className="donation-box">
                    <h2>Donations Made</h2>
                    <p>{donationTotal} BNB</p>
                </div>
            </div>

            <div className="dashboard-actions">
                <WalletConnectButton />
            </div>

            <div className="dashboard-chart">
                <h2>Performance Overview</h2>
                <ChartComponent data={[balance, stakingRewards, donationTotal]} currency="BNB" />
            </div>

            {/* ✅ VEIKSMŲ MYGTUKAI */}
            <div className="action-buttons">
                <button onClick={() => router.push("/send")} className="action-btn">Send</button>
                <button onClick={() => router.push("/receive")} className="action-btn">Receive</button>
                <button onClick={() => router.push("/swap")} className="action-btn">Swap</button>
                <button onClick={() => router.push("/stake")} className="action-btn">Stake</button>
                <button onClick={() => router.push("/donate")} className="action-btn">Donate</button>
            </div>
        </div>
    );
}
