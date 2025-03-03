simport { supabase } from "../lib/supabaseClient";
import { ethers } from "ethers";
import { ADMIN_DONATION_WALLET } from "./donationsData";

const BSC_RPC = "https://bsc-dataseed.binance.org/";

export const processDonation = async (wallet, amount, fundWallet) => {
    try {
        const provider = new ethers.providers.JsonRpcProvider(BSC_RPC);
        const signer = provider.getSigner(wallet);

        const fee = (parseFloat(amount) * 0.03).toFixed(4);
        const finalAmount = (parseFloat(amount) - parseFloat(fee)).toFixed(4);

        const transactions = [
            { to: ADMIN_DONATION_WALLET, value: ethers.utils.parseEther(fee) },
            { to: fundWallet, value: ethers.utils.parseEther(finalAmount) }
        ];

        const txResults = await Promise.all(transactions.map(tx => signer.sendTransaction(tx)));
        await Promise.all(txResults.map(tx => tx.wait()));

        await supabase.from("donations").insert({
            donor_wallet: wallet,
            amount: finalAmount,
            fee,
            fund_wallet: fundWallet,
            timestamp: new Date().toISOString(),
        });

        return { success: true, sentAmount: finalAmount, fee };
    } catch (error) {
        console.error("Donation failed:", error);
        return { success: false };
    }
};
