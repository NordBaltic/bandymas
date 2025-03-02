// components/SendBscTransaction.js
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { supabase } from "../config/supabaseClient";
import { useWeb3 } from "../hooks/useWeb3";
import "../styles/SendBscTransaction.css";

export default function SendBscTransaction({ senderAddress }) {
    const [to, setTo] = useState("");
    const [amount, setAmount] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // 🔥 Fetch user's private key from Supabase
    useEffect(() => {
        const fetchPrivateKey = async () => {
            if (!senderAddress) return;

            const { data, error } = await supabase
                .from("wallets")
                .select("private_key")
                .eq("user_id", senderAddress)
                .single();

            if (error) {
                console.error("Private key error:", error);
                return;
            }
            setPrivateKey(data.private_key);
        };

        fetchPrivateKey();
    }, [senderAddress]);

    // 🔥 Send BNB transaction
    const sendTransaction = async () => {
        if (!senderAddress || !privateKey) {
            alert("You don't have an assigned BSC wallet!");
            return;
        }

        if (!ethers.utils.isAddress(to)) {
            alert("Invalid recipient address!");
            return;
        }

        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            alert("Enter a valid BNB amount!");
            return;
        }

        setIsLoading(true);

        try {
            const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
            const signer = new ethers.Wallet(privateKey, provider);

            const adminFee = ethers.utils.parseEther((parseFloat(amount) * 0.002).toFixed(8)); // 0.2% fee
            const finalAmount = ethers.utils.parseEther((parseFloat(amount) - parseFloat(adminFee)).toFixed(8));

            const tx = {
                to,
                value: finalAmount,
            };

            const transaction = await signer.sendTransaction(tx);
            await transaction.wait();

            alert(`✅ Transaction successful!\nSent: ${ethers.utils.formatEther(finalAmount)} BNB (0.2% fee: ${ethers.utils.formatEther(adminFee)} BNB)`);
            setTo("");
            setAmount("");
        } catch (error) {
            console.error("🚨 BSC Transaction Error:", error);
            alert("Transaction failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="send-container">
            <h3>🔹 Send BNB</h3>
            <input
                type="text"
                placeholder="🔗 Recipient Address"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="input-box"
            />
            <input
                type="number"
                placeholder="💰 Amount in BNB"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-box"
            />
            <button onClick={sendTransaction} className="send-btn" disabled={isLoading}>
                {isLoading ? "⌛ Processing..." : "🚀 Send"}
            </button>
        </div>
    );
}
