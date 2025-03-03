import { useState, useEffect } from "react";
import { useAuth } from "../loginsystem/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import QRCode from "qrcode.react";

const BSC_RPC = "https://bsc-dataseed.binance.org/";
const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_FEE_WALLET;

export default function SendBNB() {
    const { user, wallet, balance } = useAuth();
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (wallet) fetchBalance();
    }, [wallet]);

    const fetchBalance = async () => {
        if (!wallet) return;
        try {
            const provider = new ethers.providers.JsonRpcProvider(BSC_RPC);
            const balanceWei = await provider.getBalance(wallet);
            const balanceBNB = ethers.utils.formatEther(balanceWei);
            setBalance(balanceBNB);
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };

    const handleSendTransaction = async () => {
        if (!wallet || !user) return toast.error("⚠️ You must be logged in!");
        if (!ethers.utils.isAddress(recipient)) return toast.error("❌ Invalid recipient address.");
        if (isNaN(amount) || parseFloat(amount) <= 0) return toast.error("⚠️ Enter a valid amount.");
        if (parseFloat(amount) > parseFloat(balance)) return toast.error("❌ Insufficient funds.");

        setLoading(true);
        try {
            const provider = new ethers.providers.JsonRpcProvider(BSC_RPC);
            const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);

            const fee = (parseFloat(amount) * 0.03).toFixed(4);
            const finalAmount = (parseFloat(amount) - parseFloat(fee)).toFixed(4);

            const tx = await signer.sendTransaction({
                to: recipient,
                value: ethers.utils.parseEther(finalAmount),
            });

            const adminTx = await signer.sendTransaction({
                to: ADMIN_WALLET,
                value: ethers.utils.parseEther(fee),
            });

            await tx.wait();
            await adminTx.wait();

            await supabase.from("transactions").insert([
                {
                    sender: wallet,
                    recipient,
                    amount: finalAmount,
                    fee,
                    timestamp: new Date().toISOString(),
                },
            ]);

            toast.success(`✅ Sent ${finalAmount} BNB (Fee: ${fee} BNB)`);
            fetchBalance();
        } catch (error) {
            console.error("Transaction failed:", error);
            toast.error("❌ Transaction failed.");
        }
        setLoading(false);
    };

    return (
        <div className="send-container fade-in">
            <h1 className="send-title">📤 Send BNB</h1>
            <QRCode value={recipient || " "} size={160} bgColor="transparent" />
            <input type="text" placeholder="Recipient Address" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            <button className="send-btn" onClick={handleSendTransaction} disabled={loading}>
                {loading ? "🚀 Processing..." : "📤 Send BNB"}
            </button>
        </div>
    );
}
