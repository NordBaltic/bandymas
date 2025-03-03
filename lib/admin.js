// lib/admin.js
import { supabase } from "../lib/supabaseClient";

// Fetch admin fees log
export async function fetchAdminFees() {
    const { data, error } = await supabase.from('admin_fees').select('*').order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching admin fees:", error);
        return [];
    }
    return data;
}

// Fetch fee settings
export async function fetchFeeSettings() {
    const { data, error } = await supabase.from('fee_settings').select('*');

    if (error) {
        console.error("Error fetching fee settings:", error);
        return [];
    }
    return data;
}

// Update fee percentage
export async function updateFee(type, newFee) {
    const { error } = await supabase.from('fee_settings').update({ fee: newFee }).eq('type', type);

    if (error) {
        console.error("Error updating fee:", error);
        return false;
    }
    return true;
}

// Fetch all users
export async function fetchUsers() {
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
        console.error("Error fetching users:", error);
        return [];
    }
    return data;
}

// Ban or Unban user
export async function toggleUserBan(userId, banStatus) {
    const { error } = await supabase.from('users').update({ banned: banStatus }).eq('id', userId);
    return !error;
}

// Fetch contracts
export async function fetchContracts() {
    const { data, error } = await supabase.from('contracts').select('*');

    if (error) {
        console.error("Error fetching contracts:", error);
        return {};
    }

    return data.reduce((acc, contract) => {
        acc[contract.type] = contract.address;
        return acc;
    }, {});
}

// Update contract address
export async function updateContract(type, address) {
    const { error } = await supabase.from('contracts').update({ address }).eq('type', type);

    if (error) {
        console.error("Error updating contract:", error);
        return false;
    }
    return true;
}
