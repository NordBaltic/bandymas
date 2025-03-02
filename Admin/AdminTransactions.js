import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import Loading from "../components/Loading";
import "./AdminTransactions.css";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchTransactions() {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
      } else {
        setTransactions(data);
      }
      setLoading(false);
    }

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    if (filter && tx.type !== filter) return false;
    if (search && !tx.address.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="admin-container">
      <h2 className="admin-title">Transactions Dashboard</h2>

      {/* 🔎 FILTER & SEARCH */}
      <div className="filter-container">
        <select onChange={(e) => setFilter(e.target.value)} className="filter-dropdown">
          <option value="">All Transactions</option>
          <option value="staking">Staking</option>
          <option value="swap">Swap</option>
          <option value="donation">Donation</option>
          <option value="transfer">Transfer</option>
        </select>

        <input
          type="text"
          placeholder="Search by address..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🔄 LOADING */}
      {loading ? (
        <Loading size="large" fullscreen={false} />
      ) : (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Tx ID</th>
              <th>Type</th>
              <th>Address</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.id}</td>
                <td className={`tx-type ${tx.type}`}>{tx.type}</td>
                <td>{tx.address}</td>
                <td>{tx.amount} BNB</td>
                <td className={`tx-status ${tx.status}`}>{tx.status}</td>
                <td>
                  {tx.status === "pending" && <button className="approve-btn">Approve</button>}
                  {tx.status !== "rejected" && <button className="reject-btn">Reject</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
