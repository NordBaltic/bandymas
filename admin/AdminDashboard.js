import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import "./admin.css";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalFees: 0,
        totalUsers: 0,
        totalDonations: 0,
        totalSwaps: 0,
        activeStakers: 0,
    });

    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchStats();
        const interval = setInterval(() => {
            fetchStats();
        }, 30000); // Kas 30 sekundžių atnaujina statistiką automatiškai
        return () => clearInterval(interval);
    }, []);

    // ✅ Gauna esamą statistiką
    const fetchStats = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("stats").select("*").single();
        if (error) {
            console.error("Nepavyko gauti statistikos:", error);
            toast.error("⚠️ Nepavyko atnaujinti duomenų");
        } else {
            setStats(data);
        }
        setLoading(false);
    };

    return (
        <div className="admin-dashboard-container fade-in">
            <h1 className="admin-title">👑 Admin Panelė</h1>

            {/* 🔥 STATISTIKOS LENTELĖ */}
            <div className="stats-grid">
                {loading ? (
                    <p className="loading-text">⏳ Kraunama statistika...</p>
                ) : (
                    <>
                        <div className="stat-box glass-morph">
                            <h3>💰 Viso surinkta iš mokesčių</h3>
                            <p>{stats.totalFees} BNB</p>
                        </div>
                        <div className="stat-box glass-morph">
                            <h3>👥 Aktyvūs vartotojai</h3>
                            <p>{stats.totalUsers}</p>
                        </div>
                        <div className="stat-box glass-morph">
                            <h3>🎁 Surinktos aukos</h3>
                            <p>{stats.totalDonations} BNB</p>
                        </div>
                        <div className="stat-box glass-morph">
                            <h3>🔄 Swaps atlikta</h3>
                            <p>{stats.totalSwaps}</p>
                        </div>
                        <div className="stat-box glass-morph">
                            <h3>🏦 Aktyvūs stakeriai</h3>
                            <p>{stats.activeStakers}</p>
                        </div>
                    </>
                )}
            </div>

            {/* 🔥 ADMIN VEIKSMAI */}
            <div className="actions-grid">
                <button 
                    className={`admin-action-btn ${refreshing ? "loading" : ""}`} 
                    onClick={async () => {
                        setRefreshing(true);
                        await fetchStats();
                        setRefreshing(false);
                        toast.success("✅ Duomenys atnaujinti!");
                    }}
                    disabled={refreshing}
                >
                    {refreshing ? "🔄 Atnaujinama..." : "🔄 Atnaujinti duomenis"}
                </button>

                <button className="admin-action-btn" onClick={() => toast.success("✅ Balansas papildytas!")}>
                    💰 Papildyti balansą
                </button>

                <button className="admin-action-btn danger" onClick={() => toast.error("🚨 Kompensacija pritaikyta!")}>
                    ⚠️ Atimti žalą
                </button>

                <button className="admin-action-btn settings-btn" onClick={() => toast("⚙️ Nustatymai atnaujinti!")}>
                    ⚙️ Administravimo nustatymai
                </button>
            </div>
        </div>
    );
}
