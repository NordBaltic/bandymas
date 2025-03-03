import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../loginsystem/AuthProvider";
import "../styles/TransactionHistory.css";

export default function TransactionHistory() {
    const { wallet } = useAuth();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        if (wallet) fetchTransactions();
        const subscription = supabase
            .from("transactions")
            .on("INSERT", payload => {
                setTransactions(prev => [payload.new, ...prev]);
            })
            .subscribe();

        return () => {
            supabase.removeSubscription(subscription);
        };
    }, [wallet]);

    const fetchTransactions = async () => {
        const { data, error } = await supabase
            .from("transactions")
            .select("*")
            .eq("sender", wallet)
            .order("timestamp", { ascending: false });

        if (!error) setTransactions(data);
    };

    return (
        <div className="transaction-history-container">
            <h3>📜 Transaction History</h3>
            <ul>
                {transactions.length > 0 ? (
                    transactions.map((tx, index) => (
                        <li key={index} className="transaction-item">
                            <span className="tx-amount">{tx.amount} BNB</span>
                            <span className="tx-recipient">➡️ {tx.recipient}</span>
                            <span className="tx-timestamp">{new Date(tx.timestamp).toLocaleString()}</span>
                        </li>
                    ))
                ) : (
                    <p className="no-transactions">No transactions found</p>
                )}
            </ul>
        </div>
    );
}
