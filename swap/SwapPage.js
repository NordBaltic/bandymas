import { useState, useEffect } from "react";
import { useAuth, useWeb3 } from "../loginsystem/AuthProvider";
import { fetchSwapQuote, executeSwap } from "./SwapLogic";
import toast from "react-hot-toast";
import "./swap.css";

export default function SwapPage() {
    const { user } = useAuth();
    const { address, isConnected } = useWeb3();
    const [fromToken, setFromToken] = useState("BNB");
    const [toToken, setToToken] = useState("USDT");
    const [amount, setAmount] = useState("");
    const [estimatedOutput, setEstimatedOutput] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (amount) fetchEstimate();
    }, [amount, fromToken, toToken]);

    const fetchEstimate = async () => {
        if (!amount || isNaN(amount)) return;
        const quote = await fetchSwapQuote(fromToken, toToken, amount);
        if (quote) setEstimatedOutput(quote.toAmount);
    };

    const handleSwap = async () => {
        if (!user && !isConnected) return toast.error("You must be logged in!");
        if (!amount || isNaN(amount) || amount <= 0) return toast.error("Enter valid amount");

        setLoading(true);
        const swapSuccess = await executeSwap(user?.wallet || address, fromToken, toToken, amount);
        if (swapSuccess) toast.success("Swap successful!");
        else toast.error("Swap failed!");
        setLoading(false);
    };

    return (
        <div className="swap-container">
            <h3>🔄 Swap BNB to USDT</h3>
            <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <p>Estimated Output: {estimatedOutput} {toToken}</p>
            <button onClick={handleSwap} disabled={loading}>{loading ? "Swapping..." : "Swap Now"}</button>
        </div>
    );
}
