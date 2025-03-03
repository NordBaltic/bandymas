import { useEffect, useState } from "react";
import { useAuth } from "../loginsystem/AuthProvider";
import { getBscBalance } from "../lib/bscUtils";
import { getStakingInfo } from "../lib/stakingUtils";
import toast from "react-hot-toast";

export default function Dashboard() {
    const { user, wallet, logout } = useAuth();
    const [balance, setBalance] = useState("0.00");
    const [stakingData, setStakingData] = useState({ staked: "0.00", rewards: "0.00" });

    useEffect(() => {
        if (wallet) {
            fetchBalance();
            fetchStaking();
        }
    }, [wallet]);

    const fetchBalance = async () => {
        try {
            const bal = await getBscBalance(wallet);
            setBalance(bal);
        } catch (error) {
            toast.error("Failed to fetch balance");
        }
    };

    const fetchStaking = async () => {
        try {
            const data = await getStakingInfo(wallet);
            setStakingData(data);
        } catch (error) {
            toast.error("Failed to fetch staking data");
        }
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Welcome, {user?.email}</h1>
            <p className="dashboard-subtitle">Your Wallet: {wallet}</p>

            <div className="balance-box glass-morph">
                <h2>Balance</h2>
                <p className="balance-amount">{balance} BNB</p>
            </div>

            <div className="staking-box glass-morph">
                <h2>Staking</h2>
                <p>Staked: {stakingData.staked} BNB</p>
                <p>Rewards: {stakingData.rewards} BNB</p>
            </div>

            <div className="action-buttons">
                <a href="/send" className="action-btn">Send</a>
                <a href="/swap" className="action-btn">Swap</a>
                <a href="/stake" className="action-btn">Stake</a>
                <a href="/donate" className="action-btn">Donate</a>
            </div>

            <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
    );
}
