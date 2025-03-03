import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../loginsystem/AuthProvider";
import "../styles/TransactionHistory.css";

export default function TransactionHistory() {
    const { wallet } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!wallet) return;
        fetchTransactions();

        // ✅ Live real-time transakcijų gavimas
        const subscription = supabase
            .channel("transactions")
            .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, fetchTransactions)
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [wallet]);

    // ✅ Gaunamos transakcijos iš DB
    const fetchTransactions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("transactions")
            .select("*")
            .or(`sender.eq.${wallet},recipient.eq.${wallet}`)
            .order("timestamp", { ascending: false })
            .limit(10);

        if (!error) setTransactions(data);
        setLoading(false);
    };

    return (
        <div className="transaction-history fade-in">
            <h3 className="history-title">📜 Transaction History</h3>
            {loading ? (
                <p className="loading-text">🔄 Loading transactions...</p>
            ) : (
                <ul className="transaction-list">
                    {transactions.length > 0 ? (
                        transactions.map((tx, index) => (
                            <li key={index} className={`transaction-item ${tx.sender === wallet ? "sent" : "received"}`}>
                                <span className="tx-amount">{tx.amount} BNB</span>
                                <span className="tx-direction">{tx.sender === wallet ? "➡️ Sent" : "⬅️ Received"}</span>
                                <span className="tx-wallet">🔗 {tx.recipient}</span>
                                <span className="tx-timestamp">{new Date(tx.timestamp).toLocaleString()}</span>
                            </li>
                        ))
                    ) : (
                        <p className="no-transactions">No recent transactions.</p>
                    )}
                </ul>
            )}
        </div>
    );
}
