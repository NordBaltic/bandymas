import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '../hooks/useWeb3';

export default function Receive() {
    const { account } = useWeb3();
    
    return (
        <motion.div className="receive-container fade-in">
            <h2>Receive Crypto</h2>
            <p>Your BSC Address:</p>
            <code>{account}</code>
        </motion.div>
    );
}
