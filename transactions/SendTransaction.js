import { useState } from "react";
import { ethers } from "ethers";
import { useAuth } from "../loginsystem/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

const BSC_RPC_URL = "https://bsc-dataseed.binance.org/"; // Oficialus BSC RPC
const ADMIN_FEE_WALLET = process.env.NEXT_PUBLIC_ADMIN_FEE_WALLET;

export default function SendTransaction() {
    const { user } = useAuth();
    const [to, setTo] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const sendTransaction = async () => {
        if (!user) return toast.error("You must be logged in!");

        setLoading(true);
        try {
            const provider = new ethers.providers.JsonRpcProvider(BSC_RPC_URL);
            const { data: walletData } = await supabase
                .from("users")
                .select("wallet")
                .eq("id", user.id)
                .single();

            if (!walletData?.wallet) return toast.error("No wallet assigned!");

            const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);

            const adminFee = (parseFloat(amount) * 0.03).toFixed(4);
            const finalAmount = (parseFloat(amount) - parseFloat(adminFee)).toFixed(4);

            const tx = await signer.sendTransaction({
                to,
                value: ethers.utils.parseEther(finalAmount),
            });

            const adminTx = await signer.sendTransaction({
                to: ADMIN_FEE_WALLET,
                value: ethers.utils.parseEther(adminFee),
            });

            await tx.wait();
            await adminTx.wait();

            toast.success(`Transaction successful! Sent ${finalAmount} BNB (3% fee: ${adminFee} BNB)`);

            await supabase.from("transactions").insert([
                { user_id: user.id, type: "sent", to, amount: finalAmount, fee: adminFee, timestamp: new Date().toISOString() },
            ]);
        } catch (error) {
            console.error("Transaction failed:", error);
            toast.error("Transaction failed.");
        }
        setLoading(false);
    };

    return (
        <div className="send-container">
            <h3>📤 Send BNB</h3>
            <input type="text" placeholder="Recipient Address" value={to} onChange={(e) => setTo(e.target.value)} />
            <input type="number" placeholder="Amount BNB" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button onClick={sendTransaction} disabled={loading}>
                {loading ? "Sending..." : "Send BNB"}
            </button>
        </div>
    );
}
