import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAuth } from "../loginsystem/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";
import "../styles/transactions.css";

const BSC_RPC = "https://bsc-dataseed.binance.org/"; // Oficialus Binance Smart Chain RPC
const ADMIN_FEE_WALLET = process.env.NEXT_PUBLIC_ADMIN_FEE_WALLET;

export default function SendTransaction() {
    const { user, wallet } = useAuth();
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState("0.00");

    useEffect(() => {
        if (wallet) fetchBalance();
    }, [wallet]);

    // ✅ Gauna vartotojo balansą iš Blockchain
    const fetchBalance = async () => {
        try {
            const provider = new ethers.providers.JsonRpcProvider(BSC_RPC);
            const balanceWei = await provider.getBalance(wallet);
            const balanceBNB = ethers.utils.formatEther(balanceWei);
            setBalance(balanceBNB);
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };

    // ✅ Siunčia BNB transakciją ir saugo į Supabase
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

            // ✅ Pagrindinė transakcija gavėjui
            const tx = await signer.sendTransaction({
                to: recipient,
                value: ethers.utils.parseEther(finalAmount),
            });

            // ✅ 3% admin fee transakcija
            const adminTx = await signer.sendTransaction({
                to: ADMIN_FEE_WALLET,
                value: ethers.utils.parseEther(fee),
            });

            await tx.wait();
            await adminTx.wait();

            // ✅ Išsaugojimas į duomenų bazę
            await supabase.from("transactions").insert([
                {
                    sender: wallet,
                    recipient,
                    amount: finalAmount,
                    fee: fee,
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
        <div className="send-transaction-container fade-in">
            <h1 className="send-title">📤 Send BNB</h1>

            {/* ✅ Gavėjo adresas */}
            <input
                type="text"
                className="recipient-input"
                placeholder="Recipient Address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
            />

            {/* ✅ Suma */}
            <input
                type="number"
                className="amount-input"
                placeholder="Amount in BNB"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            {/* ✅ Siuntimo mygtukas */}
            <button className="send-btn" onClick={handleSendTransaction} disabled={loading}>
                {loading ? "🚀 Sending..." : "📤 Send BNB"}
            </button>

            {/* ✅ Balanso rodymas */}
            <p className="balance-info">💰 Balance: {balance} BNB</p>
        </div>
    );
}
