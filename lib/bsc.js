// libs/bsc.js
import { ethers } from "ethers";
import { supabase } from "../config/supabaseClient";

// ✅ Sukuria naują BSC piniginę vartotojui
export async function createBscWallet(userId) {
    const wallet = ethers.Wallet.createRandom();
    const { error } = await supabase
        .from("wallets")
        .insert([{ user_id: userId, address: wallet.address, private_key: wallet.privateKey }]);

    if (error) {
        console.error("⚠️ Wallet creation error:", error);
        return null;
    }

    return wallet;
}

// ✅ Gauta vartotojo piniginės informaciją
export async function getUserWallet(userId) {
    const { data, error } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", userId)
        .single();

    if (error) {
        console.error("⚠️ Wallet fetch error:", error);
        return null;
    }

    return data;
}
