// libs/auth.js
import { supabase } from "../config/supabaseClient";
import toast from "react-hot-toast";

// ✅ Prisijungimas su el. paštu
export async function loginWithEmail(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("✅ Successfully logged in!");
        return { success: true, user: data.user };
    } catch (error) {
        console.error("⚠️ Login error:", error);
        toast.error("❌ Failed to log in.");
        return { success: false, error };
    }
}

// ✅ Registracija su el. paštu
export async function registerWithEmail(email, password) {
    try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("✅ Account created successfully!");
        return { success: true, user: data.user };
    } catch (error) {
        console.error("⚠️ Registration error:", error);
        toast.error("❌ Failed to create account.");
        return { success: false, error };
    }
}

// ✅ Atsijungimas
export async function signOut() {
    try {
        await supabase.auth.signOut();
        toast.success("👋 Logged out successfully!");
    } catch (error) {
        console.error("⚠️ Logout error:", error);
        toast.error("❌ Failed to log out.");
    }
}

// ✅ Automatinis vartotojo sesijos gavimas
export async function getUserSession() {
    try {
        const { data, error } = await supabase.auth.getUser();
        if (error) return null;
        return data.user;
    } catch (error) {
        console.error("⚠️ Session retrieval error:", error);
        return null;
    }
}
