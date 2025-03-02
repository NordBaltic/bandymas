import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import "./AdminSettings.css";

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        swapFee: 0.2,
        stakeFee: 4,
        donationFee: 3,
        selectedTheme: "dark",
        twoFA: false,
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    // ✅ Gauti dabartines nuostatas iš Supabase
    const fetchSettings = async () => {
        let { data, error } = await supabase.from("admin_settings").select("*").single();
        if (error) {
            toast.error("Nepavyko gauti nustatymų.");
            console.error(error);
        } else {
            setSettings(data);
        }
    };

    // ✅ Atnaujinti nustatymus
    const updateSettings = async (field, value) => {
        const updatedSettings = { ...settings, [field]: value };
        setSettings(updatedSettings);

        const { error } = await supabase.from("admin_settings").update(updatedSettings).eq("id", 1);
        if (error) {
            toast.error("Nepavyko atnaujinti nustatymų.");
            console.error(error);
        } else {
            toast.success("Nustatymai atnaujinti!");
        }
    };

    return (
        <div className="admin-settings-container fade-in">
            <h1 className="admin-title">⚙️ Administravimo nustatymai</h1>

            <div className="settings-box glass-morph">
                <h2>💰 Mokesčių valdymas</h2>
                <label>Swap Fee (%):</label>
                <input
                    type="number"
                    value={settings.swapFee}
                    onChange={(e) => updateSettings("swapFee", parseFloat(e.target.value))}
                />

                <label>Stake Fee (%):</label>
                <input
                    type="number"
                    value={settings.stakeFee}
                    onChange={(e) => updateSettings("stakeFee", parseFloat(e.target.value))}
                />

                <label>Donation Fee (%):</label>
                <input
                    type="number"
                    value={settings.donationFee}
                    onChange={(e) => updateSettings("donationFee", parseFloat(e.target.value))}
                />
            </div>

            <div className="settings-box glass-morph">
                <h2>🎨 Dizaino nustatymai</h2>
                <label>Pasirinkite temą:</label>
                <select value={settings.selectedTheme} onChange={(e) => updateSettings("selectedTheme", e.target.value)}>
                    <option value="dark">🌙 Tamsi</option>
                    <option value="light">☀️ Šviesi</option>
                </select>
            </div>

            <div className="settings-box glass-morph">
                <h2>🔒 Saugumo nustatymai</h2>
                <label>Įjungti 2FA autentifikaciją:</label>
                <input
                    type="checkbox"
                    checked={settings.twoFA}
                    onChange={(e) => updateSettings("twoFA", e.target.checked)}
                />
            </div>
        </div>
    );
}
