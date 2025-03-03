import React, { useState } from "react";
import { useAuth } from "../loginsystem/AuthProvider";
import { processDonation } from "./donationService";
import { DONATION_FUNDS } from "./donationsData";
import toast from "react-hot-toast";
import "../styles/donate.css";

export default function DonationsPage() {
    const { wallet } = useAuth();
    const [selectedFundIndex, setSelectedFundIndex] = useState(0);
    const [amount, setAmount] = useState("");

    const fund = DONATION_FUNDS[selectedFundIndex];

    const handleDonate = async () => {
        if (!wallet || !amount) {
            toast.error("⚠️ Please enter an amount!");
            return;
        }
        const result = await processDonation(wallet, amount, fund.wallet);
        if (result.success) {
            toast.success(`✅ Donated ${result.sentAmount} BNB to ${fund.name}!`);
        } else {
            toast.error("❌ Donation failed.");
        }
    };

    return (
        <div className="donations-container">
            <h1 className="donations-title">💖 Make a Donation</h1>

            <div className="donation-card">
                <img src={fund.image} alt={fund.name} className="fund-image" />
                <p className="fund-description">{fund.description}</p>

                <div className="carousel-controls">
                    <button onClick={() => setSelectedFundIndex((selectedFundIndex - 1 + DONATION_FUNDS.length) % DONATION_FUNDS.length)}>⬅️</button>
                    <span>{fund.name}</span>
                    <button onClick={() => setSelectedFundIndex((selectedFundIndex + 1) % DONATION_FUNDS.length)}>➡️</button>
                </div>

                <input
                    type="text"
                    placeholder="Amount in BNB"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button className="donate-btn" onClick={handleDonate}>💖 Donate</button>
            </div>
        </div>
    );
}
