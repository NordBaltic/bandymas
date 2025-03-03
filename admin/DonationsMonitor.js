import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { ethers } from "ethers";
import toast from "react-hot-toast";

export default function DonationsMonitor() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDonations();
        const subscription = supabase
            .channel("donations")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "donations" }, fetchDonations)
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const fetchDonations = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("donations").select("*");
        if (error) {
            toast.error("⚠️ Failed to load donations.");
        } else {
            setDonations(data);
        }
        setLoading(false);
    };

    return (
        <div className="admin-card">
            <h2 className="admin-title">💰 Donations Monitor</h2>
            {loading ? (
                <p className="loading-text">Loading donations...</p>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Amount</th>
                            <th>Token</th>
                            <th>Charity</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map((donation) => (
                            <tr key={donation.id}>
                                <td>{donation.user}</td>
                                <td>{ethers.utils.formatEther(donation.amount)} BNB</td>
                                <td>{donation.token}</td>
                                <td>{donation.charity}</td>
                                <td>{new Date(donation.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
