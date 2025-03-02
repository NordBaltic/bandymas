import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import ChartComponent from "../components/ChartComponent";
import WalletConnectButton from "../components/WalletConnectButton";
import SendBscTransaction from "../components/SendBscTransaction";
import SwapComponent from "../components/swap/SwapComponent";
import DonateComponent from "../components/donate/DonateComponent";
import StakeComponent from "../components/stake/StakeComponent";
import toast from "react-hot-toast";
import "./Dashboard.css";

export default function Dashboard() {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, []);

    // ✅ Gauna vartotojo informaciją iš Supabase
    const fetchUserData = async () => {
        const { data: session } = await supabase.auth.getSession();
        if (!session) return;

        setUser(session.user);
        const { data, error } = await supabase
            .from("wallets")
            .select("*")
            .eq("user_id", session.user.id)
            .single();

        if (error) {
            console.error("Klaida gaunant balansą:", error);
            return;
        }

        setBalance(data.balance);
        fetchTransactions(data.wallet_address);
    };

    // ✅ Gauna transakcijų istoriją
    const fetchTransactions = async (walletAddress) => {
        const { data, error } = await supabase
            .from("transactions")
            .select("*")
            .eq("wallet_address", walletAddress)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Klaida gaunant transakcijas:", error);
            return;
        }

        setTransactions(data);
        setLoading(false);
    };

    return (
        <div className="dashboard-container fade-in">
            <h1 className="dashboard-title">🏦 Jūsų piniginė</h1>

            {/* 🔥 PINIGINĖS BALANSAS */}
            <div className="wallet-info glass-morph">
                <h2 className="floating-balance">💰 {balance} BNB</h2>
                <WalletConnectButton />
            </div>

            {/* 🔥 GRAFINIS RODMUO */}
            <div className="chart-box">
                <ChartComponent data={[0.5, 1.2, 2.5, balance]} currency="BNB" />
            </div>

            {/* 🔥 GREITI VEIKSMAI */}
            <div className="action-buttons">
                <SendBscTransaction senderAddress={user?.wallet_address} />
                <SwapComponent />
                <DonateComponent />
                <StakeComponent />
            </div>

            {/* 🔥 TRANSAKCIJŲ ISTORIJA */}
            <div className="transactions-box">
                <h3>📜 Pavedimų istorija</h3>
                {loading ? (
                    <p>🔄 Kraunama...</p>
                ) : transactions.length > 0 ? (
                    <ul>
                        {transactions.map((tx, index) => (
                            <li key={index}>
                                {tx.amount} BNB → {tx.to}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>❌ Transakcijų nėra</p>
                )}
            </div>
        </div>
    );
}
