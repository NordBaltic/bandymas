import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import "../../styles/Admin.css"; // ✅ Teisingas kelias!

export default function AdminSettings() {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            let { data, error } = await supabase.from("settings").select("*").single();
            if (error) throw error;
            setSettings(data);
        } catch (error) {
            toast.error("⚠️ Klaida gaunant nustatymus.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateSetting = async (field, value) => {
        try {
            let { error } = await supabase.from("settings").update({ [field]: value }).eq("id", 1);
            if (error) throw error;
            setSettings(prev => ({ ...prev, [field]: value }));
            toast.success("✅ Nustatymas atnaujintas!");
        } catch (error) {
            toast.error("❌ Nepavyko atnaujinti.");
            console.error(error);
        }
    };

    return (
        <div className="admin-settings-container fade-in">
            <h2 className="admin-title">⚙️ Sistemos nustatymai</h2>
            {loading ? (
                <p>🔄 Kraunama...</p>
            ) : (
                <div className="settings-list">
                    <div className="setting-item">
                        <label>🔒 KYC Privalomas</label>
                        <input
                            type="checkbox"
                            checked={settings.kyc_required}
                            onChange={(e) => updateSetting("kyc_required", e.target.checked)}
                        />
                    </div>

                    <div className="setting-item">
                        <label>💳 Minimali depozito suma (BNB)</label>
                        <input
                            type="number"
                            value={settings.min_deposit}
                            onChange={(e) => updateSetting("min_deposit", parseFloat(e.target.value))}
                        />
                    </div>

                    <div className="setting-item">
                        <label>⚡ Transakcijų mokestis (%)</label>
                        <input
                            type="number"
                            value={settings.transaction_fee}
                            onChange={(e) => updateSetting("transaction_fee", parseFloat(e.target.value))}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
