import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../lib/walletConnect';
import { fetchBalanceData, fetchUserWallet } from '../lib/api';
import ChartComponent from '../components/ChartComponent';
import WalletStatus from '../components/WalletStatus';

export default function Dashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const { address, isConnected } = useWallet();
    const [balance, setBalance] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [currency, setCurrency] = useState('BNB/USD');
    const [walletAddress, setWalletAddress] = useState(null);
    const [recentTransactions, setRecentTransactions] = useState([]);

    useEffect(() => {
        async function checkUserAccount() {
            if (!user && !isConnected) {
                router.push('/');
                return;
            }

            let activeWallet = address;
            if (!isConnected && user) {
                const dbWallet = await fetchUserWallet(user.id);
                if (dbWallet) activeWallet = dbWallet.address;
            }

            if (activeWallet) {
                setWalletAddress(activeWallet);
                const data = await fetchBalanceData(activeWallet);
                if (data) {
                    setBalance(data.balance);
                    setChartData(data.history);
                    setRecentTransactions(data.transactions);
                }
            }
        }

        checkUserAccount();
    }, [user, isConnected]);

    return (
        <motion.div 
            className="dashboard-container fade-in"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Wallet Info */}
            <motion.div className="wallet-info glass-morph">
                <h2 className="floating-balance">Balance: {balance} {currency}</h2>
                {walletAddress && <p className="wallet-address">Wallet: {walletAddress}</p>}
                <WalletStatus />
                <div className="currency-toggle">
                    <button className={`toggle-btn ${currency === 'BNB/USD' ? 'active' : ''}`} onClick={() => setCurrency('BNB/USD')}>BNB/USD</button>
                    <button className={`toggle-btn ${currency === 'BNB/EUR' ? 'active' : ''}`} onClick={() => setCurrency('BNB/EUR')}>BNB/EUR</button>
                </div>
            </motion.div>

            {/* Chart */}
            <motion.div className="chart-box glass-morph slide-up">
                <ChartComponent data={chartData} currency={currency} />
            </motion.div>

            {/* Action Buttons */}
            <motion.div className="action-buttons">
                <button onClick={() => router.push('/send')} className="action-btn">🚀 Send</button>
                <button onClick={() => router.push('/receive')} className="action-btn">📥 Receive</button>
                <button onClick={() => router.push('/stake')} className="action-btn">💰 Stake</button>
                <button onClick={() => router.push('/donate')} className="action-btn">🎗️ Donate</button>
                <button onClick={() => router.push('/swap')} className="action-btn">🔄 Swap</button>
            </motion.div>

            {/* Recent Transactions */}
            <motion.div className="transactions-box glass-morph fade-in">
                <h3>Recent Transactions</h3>
                <ul>
                    {recentTransactions.map((tx, index) => (
                        <li key={index}>
                            {tx.type} - {tx.amount} BNB - <span>{tx.status}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>
        </motion.div>
    );
}
