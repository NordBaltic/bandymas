// components/SendBscTransaction.js
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { supabase } from "../config/supabaseClient";
import "../styles/SendBscTransaction.css";

// ✅ Naudojame aplinkos kintamuosius saugumui
const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET;
const BSC_RPC_URL = process.env.NEXT_PUBLIC_BSC_RPC_URL;

export default function SendBscTransaction({ senderAddress }) {
    const [to, setTo] = useState("");
    const [amount, setAmount] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // 🔥 Pasiimame vartotojo privatus raktą iš Supabase
    useEffect(() => {
        const fetchPrivateKey = async () => {
            if (!senderAddress) return;

            const { data, error } = await supabase
                .from("wallets")
                .select("private_key")
                .eq("user_id", senderAddress)
                .single();

            if (error) {
                console.error("❌ Private key error:", error);
                return;
            }
            setPrivateKey(data.private_key);
        };

        fetchPrivateKey();
    }, [senderAddress]);

    // ✅ Siųsti transakciją su 3% fee (vienu pavedimu)
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
            const provider = new ethers.providers.JsonRpcProvider(BSC_RPC_URL);
            const signer = new ethers.Wallet(privateKey, provider);

            const adminFee = ethers.utils.parseEther((parseFloat(amount) * 0.03).toFixed(8)); // 🔥 3% admin fee
            const finalAmount = ethers.utils.parseEther((parseFloat(amount) - parseFloat(adminFee)).toFixed(8));

            if (parseFloat(amount) <= parseFloat(ethers.utils.formatEther(adminFee))) {
                alert("The amount is too small to cover the 3% admin fee.");
                setIsLoading(false);
                return;
            }

            // ✅ Sukuriame masinį pavedimą per vieną transakciją (admin + gavėjas)
            const tx = {
                to: [ADMIN_WALLET, to],
                value: [adminFee, finalAmount],
            };

            const transaction = await signer.sendTransaction(tx);
            await transaction.wait();

            alert(`✅ Transaction successful!\nSent: ${ethers.utils.formatEther(finalAmount)} BNB\nAdmin Fee: ${ethers.utils.formatEther(adminFee)} BNB`);
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
