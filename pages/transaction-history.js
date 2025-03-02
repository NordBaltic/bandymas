import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function TransactionsHistory() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            let { data } = await supabase.from('transactions').select('*');
            if (data) setTransactions(data);
        };

        fetchTransactions();
    }, []);

    return (
        <div className="transactions-container">
            <h1>Transaction History</h1>
            <ul>
                {transactions.map((tx) => (
                    <li key={tx.id}>
                        {tx.type} - {tx.amount} BNB - <span>{tx.status}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
