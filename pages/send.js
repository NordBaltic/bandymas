import { useState } from 'react';
import { motion } from 'framer-motion';
import SendBscTransaction from '../components/SendBscTransaction';

export default function Send() {
    return (
        <motion.div className="send-container fade-in">
            <h2>Send BNB or Tokens</h2>
            <SendBscTransaction />
        </motion.div>
    );
}
