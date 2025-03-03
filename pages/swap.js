import { useState } from "react";
import { useAuth } from "../loginsystem/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import { ethers } from "ethers";
import toast from "react-hot-toast";

const PANCAKE_SWAP_IFRAME = "https://pancakeswap.finance/swap";
const SWAP_FEE_WALLET = process.env.NEXT_PUBLIC_SWAP_ADMIN_WALLET; // ✅ Swap fee wallet
const BSC_RPC = "https://bsc-dataseed.binance.org/";

export default function Swap() {
    const { user, wallet } = useAuth();
    const [amount, setAmount] = useState("");

    const handleSwap = async () => {
        if (!wallet || !amount || parseFloat(amount) <= 0) {
            toast.error("Invalid amount!");
            return;
        }

        const provider = new ethers.providers.JsonRpcProvider(BSC_RPC);
        const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
        const fee = (parseFloat(amount) * 0.002).toFixed(6);
        const finalSwapAmount = (parseFloat(amount) - parseFloat(fee)).toFixed(6);

        const tx = [
            { to: SWAP_FEE_WALLET, value: ethers.utils.parseEther(fee) }, // 0.2% fee į tavo swap wallet
            { to: wallet, value: ethers.utils.parseEther(finalSwapAmount) } // Likusi dalis grąžinama vartotojui
        ];

        try {
            const transactions = await Promise.all(tx.map(txn => signer.sendTransaction(txn)));
            await Promise.all(transactions.map(txn => txn.wait()));

            toast.success(`Swapped ${finalSwapAmount} BNB (0.2% fee: ${fee} BNB)`);
            setAmount("");
        } catch (error) {
            console.error("Swap error:", error);
            toast.error("Swap failed.");
        }
    };

    return (
        <div className="swap-container">
            <h3>🔄 Swap BNB</h3>
            <iframe className="pancake-iframe" src={PANCAKE_SWAP_IFRAME} width="100%" height="600"></iframe>
            <input type="text" placeholder="Amount to swap" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button onClick={handleSwap} className="swap-btn">Swap Now</button>
        </div>
    );
}
