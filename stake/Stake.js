import { useState } from "react";
import StakeForm from "./StakeForm";
import Unstake from "./Unstake";
import "./stake.css";

export default function StakePage() {
  const [stakedAmount, setStakedAmount] = useState(0);

  return (
    <div className="stake-container">
      <h2>Stake Your BNB with 1inch</h2>
      <StakeForm setStakedAmount={setStakedAmount} />
      <Unstake stakedAmount={stakedAmount} />
    </div>
  );
}
