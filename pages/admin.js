import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    fetchAdminFees, fetchFeeSettings, updateFee,
    fetchUsers, toggleUserBan, fetchContracts, updateContract
} from '../lib/admin';

export default function AdminPanel() {
    const [fees, setFees] = useState([]);
    const [feeSettings, setFeeSettings] = useState([]);
    const [users, setUsers] = useState([]);
    const [contracts, setContracts] = useState({});
    const [searchUser, setSearchUser] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [selectedFee, setSelectedFee] = useState('');
    const [newFee, setNewFee] = useState('');
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        async function loadData() {
            const feesData = await fetchAdminFees();
            setFees(feesData);

            const feeSettingsData = await fetchFeeSettings();
            setFeeSettings(feeSettingsData);

            const usersData = await fetchUsers();
            setUsers(usersData);

            const contractsData = await fetchContracts();
            setContracts(contractsData);

            // Simuliuotos notifikacijos (ateityje real-time Web3 monitoring)
            setNotifications([
                { message: "🚀 Naujas Swap pervedimas 1.2 BNB!", type: "swap" },
                { message: "💰 Nauja donacija 0.5 BNB", type: "donate" },
                { message: "⚡ Staking reward'ai buvo paskirstyti", type: "stake" },
            ]);
        }
        loadData();
    }, []);

    const handleFeeUpdate = async () => {
        if (!selectedFee || !newFee) return alert("Pasirinkite mokestį ir naują reikšmę.");
        const success = await updateFee(selectedFee, parseFloat(newFee));
        if (success) alert("Mokestis atnaujintas!");
    };

    const handleBanToggle = async (userId, status) => {
        const success = await toggleUserBan(userId, status);
        if (success) {
            setUsers(users.map(user => (user.id === userId ? { ...user, banned: status } : user)));
        }
    };

    return (
        <motion.div className={`admin-container ${darkMode ? "dark-mode" : ""} fade-in`}>
            <h1>⚡ Ultimate Admin Panel</h1>

            <button className="toggle-mode" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            <div className="notifications">
                {notifications.map((notif, index) => (
                    <motion.div key={index} className={`notif ${notif.type}`} whileHover={{ scale: 1.05 }}>
                        {notif.message}
                    </motion.div>
                ))}
            </div>

            <div className="card-container">
                <div className="card">
                    <h3>📊 Fee Management</h3>
                    <select value={selectedFee} onChange={(e) => setSelectedFee(e.target.value)}>
                        {feeSettings.map((fee) => (
                            <option key={fee.type} value={fee.type}>{fee.type}: {fee.fee}%</option>
                        ))}
                    </select>
                    <input type="number" placeholder="Naujas mokestis (%)" value={newFee} onChange={(e) => setNewFee(e.target.value)} />
                    <button className="update-fee-btn" onClick={handleFeeUpdate}>Atnaujinti</button>
                </div>

                <div className="card">
                    <h3>👥 Users Management</h3>
                    <input type="text" placeholder="🔍 Search Users..." value={searchUser} onChange={(e) => setSearchUser(e.target.value)} />
                    <ul>
                        {users.filter(user => user.email.includes(searchUser)).map((user) => (
                            <li key={user.id}>
                                {user.email} - {user.role} {user.banned ? '❌ Banned' : '✅ Active'}
                                <button onClick={() => handleBanToggle(user.id, !user.banned)}>
                                    {user.banned ? "Unban" : "Ban"}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="card">
                    <h3>🔧 Smart Contracts</h3>
                    {Object.keys(contracts).map(contractType => (
                        <div key={contractType}>
                            <label>{contractType.toUpperCase()} Contract:</label>
                            <input
                                type="text"
                                value={contracts[contractType]}
                                onChange={(e) => updateContract(contractType, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="fee-list">
                <h3>💰 Admin Fees Collected</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Tipas</th>
                            <th>Suma (BNB)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fees.map((fee) => (
                            <tr key={fee.id}>
                                <td>{new Date(fee.created_at).toLocaleString()}</td>
                                <td>{fee.type}</td>
                                <td>{fee.amount} BNB</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ✅ Nauja pridėta eilutė */}
            <motion.div className="footer-info" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p>🌍 Admin Panel - Powered by Web3 & BSC</p>
            </motion.div>
        </motion.div>
    );
}
