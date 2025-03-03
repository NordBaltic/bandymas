import { useState, useEffect } from "react";
import { useAuth } from "../loginsystem/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import { ethers } from "ethers";
import toast from "react-hot-toast";

const BSC_RPC = "https://bsc-dataseed.binance.org/";
const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_FEE_WALLET;

export default function SendBNB() {
    const { user, wallet } = useAuth();
    const [senderWallet, setSenderWallet] = useState("");
    const [toAddress, setToAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) fetchWallet();
    }, [user]);

    const fetchWallet = async () => {
        if (wallet) {
            setSenderWallet(wallet);
        } else {
            const { data } = await supabase.from("users").select("wallet").eq("id", user.id).single();
            if (data?.wallet) setSenderWallet(data.wallet);
            else toast.error("No wallet found. Please set up your wallet.");
        }
    };

    const sendTransaction = async () => {
        if (!ethers.utils.isAddress(toAddress)) {
            toast.error("Invalid recipient address.");
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            toast.error("Enter a valid amount.");
            return;
        }

        const provider = new ethers.providers.JsonRpcProvider(BSC_RPC);
        const signer = provider.getSigner(senderWallet);

        const fee = (parseFloat(amount) * 0.03).toFixed(4);
        const finalAmount = (parseFloat(amount) - parseFloat(fee)).toFixed(4);

        const tx = {
            to: [toAddress, ADMIN_WALLET],
            value: [ethers.utils.parseEther(finalAmount), ethers.utils.parseEther(fee)],
        };

        try {
            setLoading(true);
            const transaction = await signer.sendTransaction(tx);
            await transaction.wait();
            toast.success(`Success! Sent ${finalAmount} BNB. Admin fee: ${fee} BNB`);
        } catch (error) {
            console.error("BNB Transaction Error:", error);
            toast.error("Transaction failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="send-container">
            <h2>Send BNB</h2>
            <input type="text" placeholder="Recipient Address" value={toAddress} onChange={(e) => setToAddress(e.target.value)} />
            <input type="text" placeholder="Amount in BNB" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button onClick={sendTransaction} disabled={loading}>{loading ? "Processing..." : "Send BNB"}</button>
        </div>
    );
}
