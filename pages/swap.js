import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Swap() {
    const [fromToken, setFromToken] = useState("BNB");
    const [toToken, setToToken] = useState("USDT");

    const pancakeSwapUrl = `https://pancakeswap.finance/swap?outputCurrency=${toToken}&inputCurrency=${fromToken}&slippage=0.5`;

    return (
        <motion.div className="swap-container fade-in">
            <h2>Swap Tokens</h2>

            <label>From:</label>
            <select value={fromToken} onChange={(e) => setFromToken(e.target.value)}>
                <option value="BNB">BNB</option>
                <option value="0x55d398326f99059fF775485246999027B3197955">USDT</option>
            </select>

            <label>To:</label>
            <select value={toToken} onChange={(e) => setToToken(e.target.value)}>
                <option value="0x55d398326f99059fF775485246999027B3197955">USDT</option>
                <option value="BNB">BNB</option>
            </select>

            <a href={pancakeSwapUrl} target="_blank" rel="noopener noreferrer" className="swap-btn">
                Swap per PancakeSwap 🚀
            </a>

            <iframe
                src={pancakeSwapUrl}
                width="100%"
                height="600px"
                className="pancake-iframe"
            ></iframe>
        </motion.div>
    );
}
