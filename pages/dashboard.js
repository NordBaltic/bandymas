import { useState, useEffect } from "react";
import { useAuth } from "../loginsystem/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import { ethers } from "ethers";
import Link from "next/link";
import toast from "react-hot-toast";

const BSC_RPC = "https://bsc-dataseed.binance.org/";

export default function Dashboard() {
    const { user, wallet } = useAuth();
    const [bnbBalance, setBnbBalance] = useState("0.00");

    useEffect(() => {
        if (wallet) fetchBalance();
    }, [wallet]);

    const fetchBalance = async () => {
        try {
            const provider = new ethers.providers.JsonRpcProvider(BSC_RPC);
            const balance = await provider.getBalance(wallet);
            setBnbBalance(ethers.utils.formatEther(balance));
        } catch (error) {
            console.error("Balance fetch error:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">💎 Welcome to NordBalticum</h1>
            <div className="wallet-info">
                <p>Your Wallet: <span className="wallet-address">{wallet || "No wallet linked"}</span></p>
                <p className="floating-balance">BNB Balance: {bnbBalance} BNB</p>
            </div>

            <div className="dashboard-buttons">
                <Link href="/send"><button className="action-btn">Send BNB</button></Link>
                <Link href="/swap"><button className="action-btn">Swap</button></Link>
                <Link href="/stake"><button className="action-btn">Stake</button></Link>
                <Link href="/donate"><button className="action-btn">Donate</button></Link>
            </div>
        </div>
    );
}
