import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getUserSession, signOut } from "../lib/auth";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const session = await getUserSession();
      if (session?.user) {
        setUser(session.user);
        await fetchWallet(session.user.id);
      }
      setLoading(false);
    };

    initializeAuth();

    // ✅ Supabase real-time autentifikacijos stebėjimas
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchWallet(session.user.id);
        } else {
          setUser(null);
          setWallet(null);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // ✅ Gauna vartotojo BSC piniginės adresą
  const fetchWallet = async (userId) => {
    const { data, error } = await supabase
      .from("wallets")
      .select("address")
      .eq("user_id", userId)
      .single();

    if (data) {
      setWallet(data.address);
    } else if (error) {
      console.error("⚠️ Wallet fetch failed:", error);
    }
  };

  // ✅ Atsijungimas iš sistemos
  const logout = async () => {
    setLoading(true);
    await signOut();
    setUser(null);
    setWallet(null);
    toast.success("👋 Logged out successfully!");
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, wallet, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook'as autentifikacijai naudoti bet kurioje vietoje
export const useAuth = () => useContext(AuthContext);
