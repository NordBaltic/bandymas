import React, { useEffect, useState } from 'react';
import { fetchBalanceData } from '../lib/api';

const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBalance = async () => {
            try {
                const data = await fetchBalanceData();
                setBalance(data.balance);
            } catch (error) {
                console.error('Error fetching balance:', error);
            } finally {
                setLoading(false);
            }
        };

        loadBalance();
    }, []);

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Dashboard</h1>
            {loading ? <p>Loading balance...</p> : <p>Current Balance: {balance} ETH</p>}
        </div>
    );
};

export default Dashboard;
