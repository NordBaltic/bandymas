import { useState, useEffect } from "react";
import { useAuth } from "../loginsystem/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import { ethers } from "ethers";
import QRCode from "qrcode.react";
import toast from "react-hot-toast";

const BSC_MAINNET = "https://bsc-dataseed.binance.org/";
const TOKENS = [
    { name: "BNB", address: "YOUR_BNB_WALLET_ADDRESS" },
    { name: "NordToken", address: "YOUR_TOKEN_CONTRACT_ADDRESS" }
];

export default function Receive() {
    const { wallet, balance } = useAuth();
    const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
    const [copySuccess, setCopySuccess] = useState(false);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        fetchBalance();
        fetchTransactionHistory();
    }, [wallet, selectedToken]);

    const fetchBalance = async () => {
        if (!wallet) return;
        try {
            const provider = new ethers.providers.JsonRpcProvider(BSC_MAINNET);
            const balanceWei = await provider.getBalance(wallet);
            const balanceBNB = ethers.utils.formatEther(balanceWei);
            setBalance(balanceBNB);
        } catch (error) {
            console.error("Failed to fetch balance:", error);
        }
    };

    const fetchTransactionHistory = async () => {
        const { data, error } = await supabase
            .from("transactions")
            .select("*")
            .eq("recipient", wallet)
            .order("created_at", { ascending: false })
            .limit(5);

        if (!error) {
            setChartData(data);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(selectedToken.address);
        setCopySuccess(true);
        toast.success("📋 Address copied!");
        setTimeout(() => setCopySuccess(false), 1500);
    };

    return (
        <div className="receive-container fade-in">
            <h1 className="receive-title">📥 Receive Funds</h1>

            <div className="token-select">
                <label>Select Token:</label>
                <select
                    value={selectedToken.name}
                    onChange={(e) => setSelectedToken(TOKENS.find(t => t.name === e.target.value))}
                >
                    {TOKENS.map(token => (
                        <option key={token.name} value={token.name}>
                            {token.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="qr-box glass-morph">
                <QRCode value={selectedToken.address} size={160} bgColor="transparent" />
                <p className="wallet-address">{selectedToken.address}</p>
                <button className="copy-btn" onClick={copyToClipboard}>
                    📋 {copySuccess ? "Copied!" : "Copy Address"}
                </button>
            </div>

            <div className="balance-section">
                <h3>💰 Your Balance</h3>
                <p className="balance">{balance} {selectedToken.name}</p>
                <div className="chart-container">
                    <p>📊 Transaction history graph here</p>
                </div>
            </div>
        </div>
    );
}
