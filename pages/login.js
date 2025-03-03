// pages/login.js
import { useState } from "react";
import { useAuth } from "../loginsystem/AuthProvider";

export default function Login() {
    const { loginWithEmail } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await loginWithEmail(email, password);
            // Redirect to dashboard or some other page
        } catch (error) {
            console.error("Login error:", error.message);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
