import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleResetPassword = async () => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "https://yourwebsite.com/reset-confirm",
        });

        if (error) {
            setMessage("Error: " + error.message);
        } else {
            setMessage("A password reset link has been sent to your email.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Reset Password</h2>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button className="primary-btn" onClick={handleResetPassword}>
                Send Reset Link
            </button>
            {message && <p className="status-text">{message}</p>}
        </div>
    );
}
