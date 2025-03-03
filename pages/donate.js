import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../loginsystem/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import "../styles/Donate.css";

const BSC_RPC = "https://bsc-dataseed.binance.org/";
const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_DONATION_WALLET;

const CHARITIES = [
    {
        name: "Red Cross",
        description: "Providing humanitarian aid worldwide.",
        image: "/images/redcross.jpg",
        wallet: "0x73f7727D0E2A6A8489B22212F00A61814D1c112B"
    },
    {
        name: "UNICEF",
        description: "Helping children in need worldwide.",
        image: "/images/unicef.jpg",
        wallet: "0x3eE427b6D69426Df1E35426D7566D60b2741427A"
    },
    {
        name: "World Wildlife Fund",
        description: "Protecting nature and wildlife globally.",
        image: "/images/wwf.jpg",
        wallet: "0x1Ff48b733d1798d2CcCfD10919E8F9b1a0F2b73F"
    }
];

export default function Donate() {
    const { wallet } = useAuth();
    const [amount, setAmount] = useState("");
    const [selectedCharity, setSelectedCharity] = useState(CHARITIES[0]);
    const [loading, setLoading] = useState(false);

    // ✅ Atlieka aukojimą su 3% admin fee
    const handleDonate = async () => {
        if (!wallet) return toast.error("⚠️ Connect your wallet first!");
        if (!amount || parseFloat(amount) <= 0) return toast.error("❌ Enter a valid amount!");

        setLoading(true);
        try {
            const provider = new ethers.providers.JsonRpcProvider(BSC_RPC);
            const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
            
            const fee = (parseFloat(amount) * 0.03).toFixed(4);
            const donationAmount = (parseFloat(amount) - parseFloat(fee)).toFixed(4);

            // ✅ Transakcijos: 3% admin fee + likusi suma labdarai
            const tx = [
                { to: ADMIN_WALLET, value: ethers.utils.parseEther(fee) }, // Admin fee
                { to: selectedCharity.wallet, value: ethers.utils.parseEther(donationAmount) } // Aukojimo suma
            ];

            const transactions = await Promise.all(tx.map(txn => signer.sendTransaction(txn)));
            await Promise.all(transactions.map(txn => txn.wait()));

            // ✅ Saugojimas į DB
            await supabase.from("donations").insert([
                {
                    donor: wallet,
                    charity: selectedCharity.name,
                    amount: donationAmount,
                    fee,
                    timestamp: new Date().toISOString(),
                },
            ]);

            toast.success(`✅ Donated ${donationAmount} BNB to ${selectedCharity.name} (3% fee: ${fee} BNB)`);
            setAmount("");
        } catch (error) {
            console.error("Donation failed:", error);
            toast.error("❌ Donation failed.");
        }
        setLoading(false);
    };

    return (
        <motion.div className="donate-container fade-in">
            <h1 className="donate-title">🌍 Support a Cause</h1>

            {/* ✅ Labdaros pasirinkimas */}
            <div className="charity-carousel">
                {CHARITIES.map((charity, index) => (
                    <motion.div
                        key={index}
                        className={`charity-card ${selectedCharity.name === charity.name ? "active" : ""}`}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedCharity(charity)}
                    >
                        <img src={charity.image} alt={charity.name} className="charity-image"/>
                        <h3>{charity.name}</h3>
                        <p>{charity.description}</p>
                    </motion.div>
                ))}
            </div>

            {/* ✅ Aukojimo įvestis ir mygtukas */}
            <div className="donation-box">
                <input
                    type="number"
                    className="donation-input"
                    placeholder="Enter BNB Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button className="donate-btn" onClick={handleDonate} disabled={loading}>
                    {loading ? "🚀 Processing..." : `🙏 Donate to ${selectedCharity.name}`}
                </button>
            </div>
        </motion.div>
    );
}
