import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import "./Admin.css";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalFees: 0,
        totalUsers: 0,
        totalDonations: 0,
        totalSwaps: 0,
        activeStakers: 0,
    });

    useEffect(() => {
        fetchStats();
    }, []);

    // ✅ Gauna esamą statistiką
    const fetchStats = async () => {
        const { data, error } = await supabase.from("stats").select("*").single();
        if (error) {
            console.error("Nepavyko gauti statistikos:", error);
            return;
        }
        setStats(data);
    };

    return (
        <div className="admin-dashboard-container fade-in">
            <h1 className="admin-title">👑 Admin Panelė</h1>

            {/* 🔥 STATISTIKOS LENTELĖ */}
            <div className="stats-grid">
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
            </div>

            {/* 🔥 ADMIN VEIKSMAI */}
            <div className="actions-grid">
                <button className="admin-action-btn" onClick={() => toast("🔄 Gaunama informacija...")}>
                    🔄 Atnaujinti duomenis
                </button>
                <button className="admin-action-btn" onClick={() => toast.success("✅ Balansas papildytas!")}>
                    💰 Papildyti balansą
                </button>
                <button className="admin-action-btn" onClick={() => toast.error("🚨 Kompensacija pritaikyta!")}>
                    ⚠️ Atimti žalą
                </button>
                <button className="admin-action-btn" onClick={() => toast("⚙️ Nustatymai atnaujinti!")}>
                    ⚙️ Administravimo nustatymai
                </button>
            </div>
        </div>
    );
}
