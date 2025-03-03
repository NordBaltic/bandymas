import { useTransactions } from "../transactions/TransactionsContext";
import { useAuth } from "../loginsystem/AuthProvider";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function TransactionPage() {
    const { transactions, fetchTransactions } = useTransactions();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchTransactions(user.id);
            setLoading(false);
        }
    }, [user]);

    return (
        <div className="transaction-container">
            <h2>🔄 Transaction History</h2>
            {loading ? <p>Loading transactions...</p> : (
                <ul className="transaction-list">
                    {transactions.map((tx, index) => (
                        <li key={index} className={tx.type === "sent" ? "sent" : "received"}>
                            <p>{tx.type === "sent" ? "📤 Sent" : "📥 Received"} {tx.amount} BNB</p>
                            <p>To: {tx.to}</p>
                            <p>Date: {new Date(tx.timestamp).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
