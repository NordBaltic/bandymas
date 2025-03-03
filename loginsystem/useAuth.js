import { createContext, useContext, useEffect, useState } from "react";
import { loginWithEmail, registerWithEmail, logout } from "./auth";
import { supabase } from "../supabaseClient";

// ✅ Autentifikacijos konteksto sukūrimas
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Tikriname sesiją kai puslapis užkraunamas
    useEffect(() => {
        async function fetchUser() {
            const { data: session } = await supabase.auth.getSession();

            if (session?.user) {
                setUser(session.user);

                // ✅ Tikriname, ar vartotojas turi priskirtą BSC wallet
                const { data: walletData } = await supabase
                    .from("users")
                    .select("wallet")
                    .eq("id", session.user.id)
                    .single();

                if (walletData?.wallet) {
                    setWallet(walletData.wallet);
                } else {
                    console.warn("Vartotojas neturi priskirtos piniginės!");
                }
            }

            setLoading(false);
        }

        fetchUser();
    }, []);

    // ✅ Registracija
    const register = async (email, password) => {
        const result = await registerWithEmail(email, password);
        if (result.success) {
            setUser(result.user);
            setWallet(result.wallet.address);
        }
    };

    // ✅ Prisijungimas
    const login = async (email, password) => {
        const result = await loginWithEmail(email, password);
        if (result.success) {
            setUser(result.user);
            setWallet(result.wallet);
        }
    };

    // ✅ Atsijungimas
    const handleLogout = async () => {
        await logout();
        setUser(null);
        setWallet(null);
    };

    return (
        <AuthContext.Provider value={{ user, wallet, login, register, handleLogout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// ✅ Lengvas būdas naudoti autentifikacijos informaciją
export const useAuth = () => useContext(AuthContext);
