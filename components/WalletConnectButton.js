import { useWallet } from '../lib/rainbowKit';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function WalletConnectButton() {
  const { login, isConnected, address, logout } = useWallet();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login();
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Failed to connect wallet.');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      toast.success('Wallet disconnected!');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to disconnect.');
    }
    setLoading(false);
  };

  return (
    <div className="wallet-container fade-in">
      {isConnected ? (
        <div className="connected-box glass-morph">
          <p className="status-text">✅ Connected</p>
          <p className="wallet-address">{address}</p>
          <button className="wallet-button logout" onClick={handleLogout} disabled={loading}>
            <img src="/icons/logout.svg" className="button-icon" alt="Logout" />
            <span>{loading ? 'Disconnecting...' : 'Disconnect'}</span>
          </button>
        </div>
      ) : (
        <button className="wallet-button connect" onClick={handleLogin} disabled={loading}>
          <img src="/icons/walletconnect.svg" className="button-icon" alt="WalletConnect" />
          <span>{loading ? 'Connecting...' : 'Connect Wallet'}</span>
        </button>
      )}
    </div>
  );
}
