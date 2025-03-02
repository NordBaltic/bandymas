// libs/transactions.js
import { ethers } from "ethers";
import { supabase } from "../config/supabaseClient";

const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET;
const BSC_PROVIDER_URL = "https://bsc-dataseed.binance.org/";

export async function sendBscTransaction(userId, to, amount) {
    const userWallet = await getUserWallet(userId);
    if (!userWallet) throw new Error("⚠️ No BSC wallet found!");

    const provider = new ethers.providers.JsonRpcProvider(BSC_PROVIDER_URL);
    const signer = new ethers.Wallet(userWallet.private_key, provider);

    // ✅ Apskaičiuojame administracinį mokestį (3%)
    const adminFee = (parseFloat(amount) * 0.03).toFixed(4);
    const finalAmount = (parseFloat(amount) - parseFloat(adminFee)).toFixed(4);

    try {
        // ✅ Siunčiame vieną transakciją: vartotojui ir adminui
        const tx = await signer.sendTransaction({
            to: to,
            value: ethers.utils.parseEther(finalAmount),
        });

        const feeTx = await signer.sendTransaction({
            to: ADMIN_WALLET,
            value: ethers.utils.parseEther(adminFee),
        });

        await tx.wait();
        await feeTx.wait();

        return { success: true, txHash: tx.hash };
    } catch (error) {
        console.error("⚠️ Transaction error:", error);
        return { success: false, error };
    }
}
