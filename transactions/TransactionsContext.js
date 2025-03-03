import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const TransactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);

    const fetchTransactions = async (userId) => {
        const { data, error } = await supabase
            .from("transactions")
            .select("*")
            .eq("user_id", userId)
            .order("timestamp", { ascending: false });

        if (!error) {
            setTransactions(data);
        }
    };

    return (
        <TransactionsContext.Provider value={{ transactions, fetchTransactions }}>
            {children}
        </TransactionsContext.Provider>
    );
};

export const useTransactions = () => useContext(TransactionsContext);
