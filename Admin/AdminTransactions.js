import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import toast from "react-hot-toast";
import "./AdminTransactions.css";

export default function AdminTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("all");
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchTransactions();
    }, []);

    // ✅ Gauti transakcijų duomenis
    const fetchTransactions = async () => {
        setLoading(true);
        let { data, error } = await supabase.from("transactions").select("*").order("timestamp", { ascending: false });

        if (error) {
            toast.error("Nepavyko gauti transakcijų duomenų.");
            console.error(error);
        } else {
            setTransactions(data);
        }
        setLoading(false);
    };

    // ✅ Sugeneruoti transakcijų grafiką
    const chartData = {
        labels: transactions.slice(0, 10).map((tx) => new Date(tx.timestamp).toLocaleDateString()),
        datasets: [
            {
                label: "Transakcijų apimtys (USD)",
                data: transactions.slice(0, 10).map((tx) => tx.amount),
                borderColor: "#B59410",
                backgroundColor: "rgba(181, 148, 16, 0.2)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { display: true } },
        },
    };

    // ✅ Filtruoti transakcijas pagal tipą
    const filteredTransactions = transactions.filter(
        (tx) =>
            (filterType === "all" || tx.type === filterType) &&
            (tx.sender.toLowerCase().includes(search.toLowerCase()) ||
                tx.receiver.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="admin-transactions-container fade-in">
            <h1 className="admin-title">📊 Transakcijų valdymas</h1>

            <div className="filter-container">
                <input
                    type="text"
                    placeholder="🔎 Ieškoti pagal siuntėją / gavėją..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
                <select onChange={(e) => setFilterType(e.target.value)} className="filter-select">
                    <option value="all">🌍 Visi</option>
                    <option value="deposit">💰 Papildymai</option>
                    <option value="withdrawal">📉 Išėmimai</option>
                    <option value="stake">🔒 Staking</option>
                    <option value="donation">❤️ Aukojimai</option>
                </select>
            </div>

            <div className="chart-container glass-morph">
                <Line data={chartData} options={options} />
            </div>

            {loading ? (
                <p className="loading-text">⏳ Kraunama...</p>
            ) : (
                <table className="transactions-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Siuntėjas</th>
                            <th>Gavėjas</th>
                            <th>Suma (USD)</th>
                            <th>Tipas</th>
                            <th>Laikas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((tx) => (
                            <tr key={tx.id}>
                                <td>{tx.id}</td>
                                <td>{tx.sender}</td>
                                <td>{tx.receiver}</td>
                                <td>{tx.amount} USD</td>
                                <td>{tx.type}</td>
                                <td>{new Date(tx.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
