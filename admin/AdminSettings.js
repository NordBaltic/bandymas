import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import "../../styles/admin.css";

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        transactionFee: 3,
        stakingFee: 3,
        donationFee: 3,
        minWithdraw: 0.01,
        adminWallet: "",
        emailNotifications: true,
        maintenanceMode: false,
    });
    const [loading, setLoading] = useState(false);
    const [admins, setAdmins] = useState([]);
    const [newAdminEmail, setNewAdminEmail] = useState("");

    useEffect(() => {
        fetchSettings();
        fetchAdmins();
    }, []);

    // ✅ Gauti nustatymus iš DB
    const fetchSettings = async () => {
        try {
            let { data, error } = await supabase.from("settings").select("*").single();
            if (error) throw error;
            setSettings(data);
        } catch (error) {
            toast.error("⚠️ Nepavyko gauti nustatymų.");
            console.error(error);
        }
    };

    // ✅ Išsaugoti nustatymus į DB
    const saveSettings = async () => {
        setLoading(true);
        try {
            let { error } = await supabase.from("settings").update(settings).eq("id", 1);
            if (error) throw error;
            toast.success("✅ Nustatymai išsaugoti!");
        } catch (error) {
            toast.error("❌ Klaida saugant nustatymus.");
            console.error(error);
        }
        setLoading(false);
    };

    // ✅ Keisti laukų reikšmes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // ✅ Gauti visus administratorius
    const fetchAdmins = async () => {
        try {
            let { data, error } = await supabase.from("admins").select("*");
            if (error) throw error;
            setAdmins(data);
        } catch (error) {
            toast.error("⚠️ Nepavyko gauti admin sąrašo.");
            console.error(error);
        }
    };

    // ✅ Pridėti naują administratorių
    const addAdmin = async () => {
        if (!newAdminEmail) return toast.error("⚠️ Įveskite el. paštą!");
        try {
            let { error } = await supabase.from("admins").insert([{ email: newAdminEmail }]);
            if (error) throw error;
            toast.success("✅ Administratorius pridėtas!");
            setNewAdminEmail("");
            fetchAdmins();
        } catch (error) {
            toast.error("❌ Klaida pridedant administratorių.");
            console.error(error);
        }
    };

    // ✅ Pašalinti administratorių
    const removeAdmin = async (email) => {
        try {
            let { error } = await supabase.from("admins").delete().eq("email", email);
            if (error) throw error;
            toast.success("✅ Administratorius pašalintas!");
            fetchAdmins();
        } catch (error) {
            toast.error("❌ Klaida šalinant administratorių.");
            console.error(error);
        }
    };

    return (
        <div className="admin-settings-container fade-in">
            <h1 className="admin-title">⚙️ Sistemos nustatymai</h1>

            <div className="settings-grid">
                {/* 🔥 Mokesčių nustatymai */}
                <div className="setting-item">
                    <label>📊 Transakcijų mokestis (%)</label>
                    <input type="number" name="transactionFee" value={settings.transactionFee} onChange={handleChange} />
                </div>
                <div className="setting-item">
                    <label>🔥 Staking mokestis (%)</label>
                    <input type="number" name="stakingFee" value={settings.stakingFee} onChange={handleChange} />
                </div>
                <div className="setting-item">
                    <label>💰 Aukojimų mokestis (%)</label>
                    <input type="number" name="donationFee" value={settings.donationFee} onChange={handleChange} />
                </div>
                <div className="setting-item">
                    <label>🔽 Minimalus išmokėjimas (BNB)</label>
                    <input type="number" name="minWithdraw" value={settings.minWithdraw} onChange={handleChange} />
                </div>
                <div className="setting-item">
                    <label>🏦 Admin piniginė</label>
                    <input type="text" name="adminWallet" value={settings.adminWallet} onChange={handleChange} />
                </div>

                {/* 🔥 Funkcijų perjungimai */}
                <div className="setting-item toggle">
                    <label>📧 El. pašto pranešimai</label>
                    <input type="checkbox" name="emailNotifications" checked={settings.emailNotifications} onChange={handleChange} />
                </div>
                <div className="setting-item toggle">
                    <label>🚧 Sistemos priežiūros režimas</label>
                    <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} />
                </div>
            </div>

            {/* 🔥 Išsaugoti nustatymus */}
            <button className="save-btn" onClick={saveSettings} disabled={loading}>
                {loading ? "⏳ Išsaugoma..." : "💾 Išsaugoti nustatymus"}
            </button>

            {/* 🔥 Admin valdymas */}
            <h2 className="admin-subtitle">👑 Administratorių valdymas</h2>
            <div className="admin-management">
                <input type="email" placeholder="🔍 Pridėti naują admin el. paštą..." value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} />
                <button onClick={addAdmin}>➕ Pridėti admin</button>
            </div>

            <ul className="admin-list">
                {admins.map((admin) => (
                    <li key={admin.email}>
                        {admin.email}
                        <button onClick={() => removeAdmin(admin.email)}>🗑️ Pašalinti</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
