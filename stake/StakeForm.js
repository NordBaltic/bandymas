import { useState } from "react";
import { stakeTokens } from "./StakeLogic";

export default function StakeForm({ setStakedAmount }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStake = async () => {
    setLoading(true);
    const result = await stakeTokens(amount);
    if (result.success) {
      setStakedAmount((prev) => prev + parseFloat(amount));
      alert(`Staked successfully! Transaction: ${result.txHash}`);
    } else {
      alert(`Error: ${result.error}`);
    }
    setLoading(false);
  };

  return (
    <div className="stake-box">
      <input
        type="number"
        placeholder="Enter BNB amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleStake} disabled={loading}>
        {loading ? "Staking..." : "Stake BNB"}
      </button>
    </div>
  );
}
