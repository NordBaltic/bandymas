import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import "../../styles/admin.css";

export default function SwapMonitor() {
    const [swaps, setSwaps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSwaps();
        const interval = setInterval(() => fetchSwaps(), 15000);
        return () => clearInterval(interval);
    }, []);

    const fetchSwaps = async () => {
        try {
            let { data, error } = await supabase.from("swaps").select("*").order("timestamp", { ascending: false });
            if (error) throw error;
            setSwaps(data);
        } catch (error) {
            console.error("❌ Nepavyko gauti swap duomenų.", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="swap-monitor-container fade-in">
            <h2 className="admin-title">🔄 Swap Monitorius</h2>
            {loading ? (
                <p>⏳ Kraunama...</p>
            ) : (
                <table className="swap-table">
                    <thead>
                        <tr>
                            <th>Vartotojas</th>
                            <th>Iš valiutos</th>
                            <th>Į valiutą</th>
                            <th>Kiekis</th>
                            <th>Laikas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {swaps.map(swap => (
                            <tr key={swap.id}>
                                <td>{swap.user_email}</td>
                                <td>{swap.from_currency}</td>
                                <td>{swap.to_currency}</td>
                                <td>{swap.amount}</td>
                                <td>{new Date(swap.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
