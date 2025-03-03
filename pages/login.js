import { useState } from "react";
import { useAuth } from "../loginsystem/useAuth";
import { useRouter } from "next/router";

export default function Login() {
    const { login, loading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const result = await login(email, password);
        if (result?.success) {
            router.push("/dashboard"); // 🔥 Po prisijungimo nukreipia į dashboard
        } else {
            setError(result?.error || "❌ Login failed.");
        }
    };

    return (
        <div className="login-container">
            <h2>🔐 Sign In</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="error-text">{error}</p>}
                <button type="submit" className="primary-btn" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            <p className="switch-text">
                Don't have an account? <a href="/register">Sign Up</a>
            </p>
        </div>
    );
}
