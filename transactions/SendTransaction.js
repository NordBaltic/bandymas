import { useState } from "react";
import { ethers } from "ethers";
import { useAuth } from "../loginsystem/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET;

export default function SendTransaction() {
    const { user } = useAuth();
    const [to, setTo] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const sendTransaction = async () => {
        if (!user) return toast.error("You must be logged in!");

        const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
        const { data: walletData } = await supabase
            .from("users")
            .select("wallet")
            .eq("id", user.id)
            .single();

        if (!walletData?.wallet) return toast.error("No wallet assigned!");

        const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
        const fee = (parseFloat(amount) * 0.03).toFixed(4);
        const finalAmount = (parseFloat(amount) - parseFloat(fee)).toFixed(4);

        try {
            const tx1 = {
                to: ADMIN_WALLET,
                value: ethers.utils.parseEther(fee),
            };

            const tx2 = {
                to,
                value: ethers.utils.parseEther(finalAmount),
            };

            await signer.sendTransaction(tx1);
            await signer.sendTransaction(tx2);
            toast.success(`Transaction successful! Sent ${finalAmount} BNB (3% fee: ${fee} BNB)`);

            await supabase.from("transactions").insert([
                { user_id: user.id, type: "sent", to, amount: finalAmount, timestamp: new Date().toISOString() },
            ]);
        } catch (error) {
            toast.error("Transaction failed.");
        }
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
