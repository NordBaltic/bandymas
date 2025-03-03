import { useState, useEffect } from "react";
import { useAuth } from "../loginsystem/AuthProvider";
import { ethers } from "ethers";
import QRCode from "qrcode.react";
import "../styles/receive.css";

const BSC_MAINNET = "https://bsc-dataseed.binance.org/";

const TOKENS = [
    { name: "BNB", address: process.env.NEXT_PUBLIC_BNB_WALLET },
    { name: "NordToken", address: process.env.NEXT_PUBLIC_NORDTOKEN_WALLET }
];

export default function Receive() {
    const { wallet } = useAuth();
    const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
    const [copySuccess, setCopySuccess] = useState(false);
    const [balance, setBalance] = useState("0.00");

    useEffect(() => {
        fetchBalance();
    }, [wallet, selectedToken]);

    const fetchBalance = async () => {
        if (!wallet) return;
        try {
            const provider = new ethers.providers.JsonRpcProvider(BSC_MAINNET);
            const balanceWei = await provider.getBalance(wallet);
            setBalance(ethers.utils.formatEther(balanceWei));
        } catch (error) {
            console.error("Balance fetch error:", error);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(selectedToken.address);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 1500);
    };

    return (
        <div className="receive-container">
            <h1>📥 Receive Funds</h1>
            <select value={selectedToken.name} onChange={(e) => setSelectedToken(TOKENS.find(t => t.name === e.target.value))}>
                {TOKENS.map(token => <option key={token.name} value={token.name}>{token.name}</option>)}
            </select>
            <QRCode value={selectedToken.address} size={160} />
            <p className="wallet-address">{selectedToken.address}</p>
            <button onClick={copyToClipboard}>{copySuccess ? "Copied!" : "Copy Address"}</button>
            <p>💰 Balance: {balance} {selectedToken.name}</p>
        </div>
    );
}
