import React, { createContext, useContext, useState, useEffect } from "react";
import { loginWithEmail, registerWithEmail, logout } from "../lib/auth";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Automatiškai tikrina vartotojo sesiją
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        await fetchWallet(data.user.id);
      } else if (error) {
        console.error("Auth check failed:", error);
      }
      setLoading(false);
    };

    checkSession();

    // 🔥 Supabase real-time sesijos monitoringas
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

  // ✅ Gauna vartotojo priskirtą BSC piniginę iš duomenų bazės
  const fetchWallet = async (userId) => {
    const { data, error } = await supabase
      .from("wallets")
      .select("address")
      .eq("user_id", userId)
      .single();

    if (data) {
      setWallet(data.address);
    } else if (error) {
      console.error("Wallet fetch failed:", error);
    }
  };

  // ✅ Prisijungimas su el. paštu
  const login = async (email, password) => {
    setLoading(true);
    const result = await loginWithEmail(email, password);
    if (result?.user) {
      setUser(result.user);
      await fetchWallet(result.user.id);
      toast.success("✅ Logged in successfully!");
    } else {
      toast.error("❌ Login failed!");
    }
    setLoading(false);
  };

  // ✅ Registracija su el. paštu (automatiškai priskiria piniginę)
  const register = async (email, password) => {
    setLoading(true);
    const result = await registerWithEmail(email, password);
    if (result?.user) {
      setUser(result.user);
      await fetchWallet(result.user.id);
      toast.success("🎉 Registration successful!");
    } else {
      toast.error("❌ Registration failed!");
    }
    setLoading(false);
  };

  // ✅ Atsijungimas iš sistemos
  const signOut = async () => {
    setLoading(true);
    await logout();
    setUser(null);
    setWallet(null);
    toast.success("👋 Logged out successfully!");
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        wallet,
        login,
        register,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Sukuria custom `useAuth` hook'ą
export const useAuth = () => {
  return useContext(AuthContext);
};
