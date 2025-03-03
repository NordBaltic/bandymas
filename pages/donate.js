import { useState } from "react";
import { useAuth } from "../loginsystem/AuthProvider";
import { ethers } from "ethers";
import styles from "../../styles/donate.css";

const BSC_RPC = "https://bsc-dataseed.binance.org/";
const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_DONATION_WALLET;

const CHARITIES = [
    { name: "Red Cross", image: "/images/redcross.jpg", wallet: process.env.NEXT_PUBLIC_REDCROSS_WALLET },
    { name: "UNICEF", image: "/images/unicef.jpg", wallet: process.env.NEXT_PUBLIC_UNICEF_WALLET },
    { name: "WWF", image: "/images/wwf.jpg", wallet: process.env.NEXT_PUBLIC_WWF_WALLET }
];

export default function Donate() {
    const { wallet } = useAuth();
    const [amount, setAmount] = useState("");
    const [selectedCharity, setSelectedCharity] = useState(CHARITIES[0]);

    const handleDonate = async () => {
        if (!wallet || !amount || parseFloat(amount) <= 0) return;

        const provider = new ethers.providers.JsonRpcProvider(BSC_RPC);
        const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);

        const fee = (parseFloat(amount) * 0.03).toFixed(4);
        const donationAmount = (parseFloat(amount) - parseFloat(fee)).toFixed(4);

        await signer.sendTransaction({ to: ADMIN_WALLET, value: ethers.utils.parseEther(fee) });
        await signer.sendTransaction({ to: selectedCharity.wallet, value: ethers.utils.parseEther(donationAmount) });
    };

    return (
        <div className="donate-container">
            <h1>🌍 Support a Cause</h1>
            {CHARITIES.map((charity) => (
                <div key={charity.name} onClick={() => setSelectedCharity(charity)}>
                    <img src={charity.image} alt={charity.name} />
                    <h3>{charity.name}</h3>
                </div>
            ))}
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button onClick={handleDonate}>Donate to {selectedCharity.name}</button>
        </div>
    );
}
