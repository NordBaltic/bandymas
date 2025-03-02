import { ethers } from 'ethers';
import { supabase } from './supabaseClient';

// ✅ Generuoja naują BSC piniginę
export function generateBSCWallet() {
    const wallet = ethers.Wallet.createRandom();
    return {
        address: wallet.address,
        privateKey: wallet.privateKey,
    };
}

// ✅ Išsaugo BSC wallet Supabase duomenų bazėje
export async function saveWalletToDB(userId, address, privateKey) {
    const { error } = await supabase
        .from('wallets')
        .insert([{ user_id: userId, address, private_key: privateKey }]);

    if (error) {
        console.error("❌ Wallet saugojimo klaida:", error);
    } else {
        console.log(`✅ Wallet priskirta vartotojui (${userId}): ${address}`);
    }
}
