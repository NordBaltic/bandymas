import { useState, useEffect } from "react";
import { useAuth } from "../loginsystem/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import QRCode from "qrcode.react";
import "../styles/Send.css";

const BSC_RPC = "https://bsc-dataseed.binance.org/";
const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_FEE_WALLET;

export default function SendBNB() {
    const { user, wallet, balance } = useAuth();
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        if (wallet) fetchTransactionHistory();
    }, [wallet]);

    // ✅ Gauti transakcijų istoriją
    const fetchTransactionHistory = async () => {
        try {
            const { data, error } = await supabase
                .from("transactions")
                .select("*")
                .eq("sender", wallet)
                .order("timestamp", { ascending: false });

            if (error) throw error;
            setTransactionHistory(data || []);
        } catch (error) {
            console.error("❌ Failed to fetch transactions:", error);
        }
    };

    // ✅ Siųsti BNB transakciją ir išsaugoti istoriją
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

            // ✅ Siųsti pagrindinę transakciją gavėjui
            const tx = await signer.sendTransaction({
                to: recipient,
                value: ethers.utils.parseEther(finalAmount),
            });

            // ✅ Siųsti 3% admin fee
            const adminTx = await signer.sendTransaction({
                to: ADMIN_WALLET,
                value: ethers.utils.parseEther(fee),
            });

            await tx.wait();
            await adminTx.wait();

            // ✅ Išsaugoti transakciją į DB
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
            fetchTransactionHistory();
        } catch (error) {
            console.error("Transaction failed:", error);
            toast.error("❌ Transaction failed.");
        }
        setLoading(false);
    };

    // ✅ Kopijuoti adresą į clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(recipient);
        setCopySuccess(true);
        toast.success("📋 Address copied!");
        setTimeout(() => setCopySuccess(false), 1500);
    };

    return (
        <div className="send-container fade-in">
            <h1 className="send-title">📤 Send BNB</h1>

            {/* ✅ Adreso įvedimas su QR kodu */}
            <div className="qr-box glass-morph">
                <QRCode value={recipient || " "} size={160} bgColor="transparent" />
                <input
                    type="text"
                    className="recipient-input"
                    placeholder="Recipient Address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
                <button className="copy-btn" onClick={copyToClipboard}>
                    📋 {copySuccess ? "Copied!" : "Copy Address"}
                </button>
            </div>

            {/* ✅ Suma ir siuntimo mygtukas */}
            <div className="amount-box">
                <input
                    type="text"
                    className="amount-input"
                    placeholder="Amount in BNB"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button className="send-btn" onClick={handleSendTransaction} disabled={loading}>
                    {loading ? "🚀 Processing..." : "📤 Send BNB"}
                </button>
            </div>

            {/* ✅ Transakcijų istorija */}
            <div className="transactions-box">
                <h3>📜 Transaction History</h3>
                <ul>
                    {transactionHistory.map((tx) => (
                        <li key={tx.id} className="transaction-item">
                            <span className="tx-amount">{tx.amount} BNB</span>
                            <span className="tx-recipient">➡️ {tx.recipient}</span>
                            <span className="tx-timestamp">{new Date(tx.timestamp).toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
