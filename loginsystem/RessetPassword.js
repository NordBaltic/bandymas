// components/ResetPassword.js
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.api
            .resetPasswordForEmail(email);

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Password reset link sent!");
        }

        setLoading(false);
    };

    return (
        <div className="reset-password-container">
            <h2>Reset your password</h2>
            <form onSubmit={handlePasswordReset}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
            </form>
        </div>
    );
}
