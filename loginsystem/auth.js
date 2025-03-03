import { supabase } from "../supabaseClient";
import { ethers } from "ethers";

// ✅ Funkcija registracijai su email
export async function registerWithEmail(email, password) {
    const { user, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) throw new Error(error.message);

    // ✅ Jei registracija sėkminga, priskiriame BSC wallet'ą
    const generatedWallet = generateBscWallet();
    await saveWalletToUser(user.id, generatedWallet);

    return { success: true, user, wallet: generatedWallet };
}

// ✅ Funkcija prisijungimui su email
export async function loginWithEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw new Error(error.message);

    // ✅ Gauname vartotojo piniginės adresą
    const { data: walletData } = await supabase
        .from("users")
        .select("wallet")
        .eq("id", data.user.id)
        .single();

    return { success: true, user: data.user, wallet: walletData?.wallet };
}

// ✅ Sukuria naują BSC wallet'ą
function generateBscWallet() {
    const wallet = ethers.Wallet.createRandom();
    return {
        address: wallet.address,
        privateKey: wallet.privateKey,
    };
}

// ✅ Išsaugo wallet'ą vartotojui į duomenų bazę
async function saveWalletToUser(userId, wallet) {
    await supabase.from("users").update({ wallet: wallet.address }).eq("id", userId);
}

// ✅ Funkcija atsijungimui
export async function logout() {
    await supabase.auth.signOut();
}
