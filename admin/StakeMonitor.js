import { useEffect, useState } from "react";
import { supabase } from "../loginsystem/supabaseClient";
import { ethers } from "ethers";
import toast from "react-hot-toast";

export default function StakeMonitor() {
    const [stakes, setStakes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStakes();
        const subscription = supabase
            .channel("stakes")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "stakes" }, fetchStakes)
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const fetchStakes = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("stakes").select("*");
        if (error) {
            toast.error("⚠️ Failed to load stakes.");
        } else {
            setStakes(data);
        }
        setLoading(false);
    };

    return (
        <div className="admin-card">
            <h2 className="admin-title">📈 Staking Monitor</h2>
            {loading ? (
                <p className="loading-text">Loading stakes...</p>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Amount</th>
                            <th>Token</th>
                            <th>APY</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stakes.map((stake) => (
                            <tr key={stake.id}>
                                <td>{stake.user}</td>
                                <td>{ethers.utils.formatEther(stake.amount)} BNB</td>
                                <td>{stake.token}</td>
                                <td>{stake.apy}%</td>
                                <td>{new Date(stake.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
