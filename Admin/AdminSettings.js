import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import "./Admin.css";

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        minStake: 0.1,
        maxStake: 100,
        stakeFee: 4,
        donationFee: 3,
        swapFee: 0.02,
        stakingWallet: "",
        donationWallet: "",
        swapWallet: "",
        enableDonations: true,
        enableSwaps: true,
        enableStaking: true,
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
        const interval = setInterval(() => {
            fetchSettings();
        }, 60000); // Kas 1 min. atnaujina nustatymus automatiškai
        return () => clearInterval(interval);
    }, []);

    // ✅ Gauna esamus nustatymus iš DB
    const fetchSettings = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase.from("settings").select("*").single();
        if (error) {
            console.error("Nepavyko gauti nustatymų:", error);
            toast.error("⚠️ Nepavyko atnaujinti nustatymų.");
        } else {
            setSettings(data);
        }
        setLoading(false);
    }, []);

    // ✅ Atlieka nustatymų atnaujinimą
    const updateSettings = async () => {
        if (!settings.stakingWallet || !settings.donationWallet || !settings.swapWallet) {
            toast.error("⚠️ Visi piniginės adresai turi būti užpildyti!");
            return;
        }
        if (settings.stakeFee < 0 || settings.donationFee < 0 || settings.swapFee < 0) {
            toast.error("⚠️ Mokesčiai negali būti neigiami!");
            return;
        }
        setSaving(true);
        const { error } = await supabase.from("settings").update(settings).eq("id", 1);
        setSaving(false);

        if (error) {
            toast.error("❌ Nepavyko išsaugoti nustatymų.");
            return;
        }
        toast.success("✅ Nustatymai išsaugoti!");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="admin-settings-container fade-in">
            <h1 className="admin-title">⚙️ Admin Nustatymai</h1>

            {loading ? (
                <p className="loading-text">⏳ Kraunama...</p>
            ) : (
                <>
                    {/* 📊 Finansiniai nustatymai */}
                    <div className="settings-section">
                        <h3>📊 Finansiniai nustatymai</h3>
                        <label>Minimalus staking kiekis (BNB)</label>
                        <input type="number" value={settings.minStake} onChange={(e) => setSettings({ ...settings, minStake: e.target.value })} />
                        
                        <label>Maksimalus staking kiekis (BNB)</label>
                        <input type="number" value={settings.maxStake} onChange={(e) => setSettings({ ...settings, maxStake: e.target.value })} />

                        <label>Staking fee (%)</label>
                        <input type="number" value={settings.stakeFee} onChange={(e) => setSettings({ ...settings, stakeFee: e.target.value })} />

                        <label>Aukojimų fee (%)</label>
                        <input type="number" value={settings.donationFee} onChange={(e) => setSettings({ ...settings, donationFee: e.target.value })} />

                        <label>Swap fee (%)</label>
                        <input type="number" value={settings.swapFee} onChange={(e) => setSettings({ ...settings, swapFee: e.target.value })} />
                    </div>

                    {/* 💰 Piniginės adresai */}
                    <div className="settings-section">
                        <h3>💰 Piniginės adresai</h3>
                        <label>Staking fee wallet</label>
                        <input type="text" value={settings.stakingWallet} onChange={(e) => setSettings({ ...settings, stakingWallet: e.target.value })} />

                        <label>Donation fee wallet</label>
                        <input type="text" value={settings.donationWallet} onChange={(e) => setSettings({ ...settings, donationWallet: e.target.value })} />

                        <label>Swap fee wallet</label>
                        <input type="text" value={settings.swapWallet} onChange={(e) => setSettings({ ...settings, swapWallet: e.target.value })} />
                    </div>

                    {/* 🔧 Funkcijų valdymas */}
                    <div className="settings-section">
                        <h3>🔧 Funkcijų valdymas</h3>
                        <label>
                            <input type="checkbox" checked={settings.enableDonations} onChange={() => setSettings({ ...settings, enableDonations: !settings.enableDonations })} />
                            Įjungti aukojimus
                        </label>
                        <label>
                            <input type="checkbox" checked={settings.enableSwaps} onChange={() => setSettings({ ...settings, enableSwaps: !settings.enableSwaps })} />
                            Įjungti keitimą
                        </label>
                        <label>
                            <input type="checkbox" checked={settings.enableStaking} onChange={() => setSettings({ ...settings, enableStaking: !settings.enableStaking })} />
                            Įjungti staking
                        </label>
                    </div>

                    <button className={`save-btn ${saving ? "saving" : ""}`} onClick={updateSettings} disabled={saving}>
                        {saving ? "💾 Išsaugoma..." : "💾 Išsaugoti"}
                    </button>
                </>
            )}
        </div>
    );
}
