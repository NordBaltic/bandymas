import { createContext, useContext, useEffect, useState } from 'react';
import { getUserSession, signOut } from '../lib/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            const session = await getUserSession();
            if (session) {
                setUser(session.user);
                setWallet(session.wallet);
            }
            setLoading(false);
        }
        fetchUser();
    }, []);

    const logout = async () => {
        await signOut();
        setUser(null);
        setWallet(null);
    };

    return (
        <AuthContext.Provider value={{ user, wallet, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
