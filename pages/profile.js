import React, { useState, useEffect } from "react";
import { useAuth } from "../loginsystem/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

export default function Profile() {
    const { user, logout } = useAuth();
    const [username, setUsername] = useState("");
    const [status, setStatus] = useState("");
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        if (user) fetchUserProfile();
    }, [user]);

    // ✅ Gauti vartotojo informaciją iš DB
    const fetchUserProfile = async () => {
        try {
            const { data, error } = await supabase
                .from("users")
                .select("username, twofa_enabled")
                .eq("id", user.id)
                .single();

            if (error) throw error;
            setUsername(data?.username || "");
            setTwoFAEnabled(data?.twofa_enabled || false);
        } catch (error) {
            toast.error("Nepavyko gauti vartotojo duomenų.");
        }
    };

    // ✅ Atnaujinti vartotojo vardą
    const handleUpdateUsername = async () => {
        if (!username.trim()) {
            toast.error("Vartotojo vardas negali būti tuščias!");
            return;
        }

        try {
            const { error } = await supabase
                .from("users")
                .update({ username })
                .eq("id", user.id);

            if (error) throw error;
            toast.success("✅ Vartotojo vardas atnaujintas!");
        } catch (error) {
            toast.error("❌ Nepavyko atnaujinti vardo.");
        }
    };

    // ✅ 2FA įjungimas/išjungimas
    const toggle2FA = async () => {
        try {
            const { error } = await supabase
                .from("users")
                .update({ twofa_enabled: !twoFAEnabled })
                .eq("id", user.id);

            if (error) throw error;
            setTwoFAEnabled(!twoFAEnabled);
            toast.success(`2FA ${!twoFAEnabled ? "įjungta" : "išjungta"}!`);
        } catch (error) {
            toast.error("❌ Nepavyko pakeisti 2FA nustatymų.");
        }
    };

    // ✅ Paskyros ištrynimas su patvirtinimu
    const handleDeleteAccount = async () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            toast("⚠️ Spauskite dar kartą, kad patvirtintumėte!");
            return;
        }

        try {
            const { error } = await supabase.from("users").delete().eq("id", user.id);
            if (error) throw error;

            toast.success("✅ Paskyra ištrinta.");
            logout(); // Automatinis atsijungimas
        } catch (error) {
            toast.error("❌ Nepavyko ištrinti paskyros.");
        }
    };

    return (
        <div className="profile-container fade-in">
            <h1 className="profile-title">👤 Nustatymai</h1>

            {/* ✅ Vartotojo informacija */}
            <div className="profile-info glass-morph">
                <p><strong>Email:</strong> {user?.email || "Web3 Vartotojas"}</p>
                <p><strong>Vartotojo vardas:</strong></p>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="profile-input"
                />
                <button className="save-btn" onClick={handleUpdateUsername}>💾 Išsaugoti</button>
            </div>

            {/* ✅ 2FA valdymas */}
            <div className="twofa-section glass-morph">
                <h3>🔒 Two-Factor Authentication</h3>
                <label className="switch">
                    <input type="checkbox" checked={twoFAEnabled} onChange={toggle2FA} />
                    <span className="slider round"></span>
                </label>
            </div>

            {/* ✅ Paskyros ištrynimas */}
            <div className="account-delete glass-morph">
                <h3>❌ Ištrinti paskyrą</h3>
                <button className="delete-btn" onClick={handleDeleteAccount}>
                    {confirmDelete ? "‼️ Patvirtinti ištrynimą" : "🚨 Ištrinti paskyrą"}
                </button>
            </div>

            {/* ✅ Logout */}
            <button className="logout-btn" onClick={logout}>🚪 Atsijungti</button>
        </div>
    );
}
