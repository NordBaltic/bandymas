import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import "./Admin.css";

export default function AdminTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("all");

    useEffect(() => {
        fetchTransactions();
    }, [filterType]);

    // ✅ Gauti visus vartotojų pavedimus
    const fetchTransactions = async () => {
        try {
            setLoading(true);
            let query = supabase.from("transactions").select("*").order("created_at", { ascending: false });

            if (filterType !== "all") {
                query = query.eq("type", filterType);
            }

            let { data, error } = await query;
            if (error) throw error;

            setTransactions(data);
        } catch (error) {
            toast.error("Nepavyko gauti transakcijų.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-transactions-container fade-in">
            <h1 className="admin-title">📜 Transakcijų valdymas</h1>

            {/* Filtravimo mygtukai */}
            <div className="filter-buttons">
                {["all", "donation", "swap", "staking", "payment", "admin_fee"].map((type) => (
                    <button 
                        key={type} 
                        className={`filter-btn ${filterType === type ? "active" : ""}`} 
                        onClick={() => setFilterType(type)}
                    >
                        {type === "all" ? "Visos" : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <p>Kraunama...</p>
            ) : (
                <table className="transactions-table">
                    <thead>
                        <tr>
                            <th>Vartotojas</th>
                            <th>Tipas</th>
                            <th>Suma</th>
                            <th>Gavėjas</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx.id}>
                                <td>{tx.user}</td>
                                <td>{tx.type}</td>
                                <td>{tx.amount} BNB</td>
                                <td>{tx.recipient}</td>
                                <td>{new Date(tx.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
