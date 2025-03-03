import { ethers } from "ethers";
import { supabase } from "../lib/supabaseClient";

const API_URL = "https://api.1inch.io/v5.0/56"; // 56 = BSC Chain
const ADMIN_SWAP_FEE_WALLET = process.env.NEXT_PUBLIC_SWAP_FEE_WALLET;
const SWAP_FEE_PERCENT = parseFloat(process.env.NEXT_PUBLIC_SWAP_FEE_PERCENT) / 100;

export async function fetchSwapQuote(fromToken, toToken, amount) {
    try {
        const response = await fetch(`${API_URL}/quote?fromTokenSymbol=${fromToken}&toTokenSymbol=${toToken}&amount=${ethers.utils.parseEther(amount)}`);
        const data = await response.json();
        if (data) return { toAmount: ethers.utils.formatEther(data.toAmount), txData: data.tx };
    } catch (error) {
        console.error("Swap Quote Error:", error);
        return null;
    }
}

export async function executeSwap(userWallet, fromToken, toToken, amount) {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        const swapFee = (parseFloat(amount) * SWAP_FEE_PERCENT).toFixed(6);
        const finalAmount = (parseFloat(amount) - parseFloat(swapFee)).toFixed(6);

        const swapData = await fetchSwapQuote(fromToken, toToken, finalAmount);
        if (!swapData) return false;

        const tx1 = await signer.sendTransaction({
            to: ADMIN_SWAP_FEE_WALLET,
            value: ethers.utils.parseEther(swapFee),
        });

        const tx2 = await signer.sendTransaction({
            to: swapData.txData.to,
            data: swapData.txData.data,
            value: swapData.txData.value,
        });

        await tx1.wait();
        await tx2.wait();

        await supabase.from("transactions").insert([
            { user_id: userWallet, type: "swap", fromToken, toToken, amount: finalAmount, timestamp: new Date().toISOString() },
        ]);

        return true;
    } catch (error) {
        console.error("Swap Execution Error:", error);
        return false;
    }
}
