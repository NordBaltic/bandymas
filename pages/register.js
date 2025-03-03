// pages/register.js
import { useState } from "react";
import { useAuth } from "../context/AuthProvider";

export default function Register() {
    const { registerWithEmail } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerWithEmail(email, password);
            // Redirect to dashboard or some other page
        } catch (error) {
            console.error("Registration error:", error.message);
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
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
                <button type="submit">Register</button>
            </form>
        </div>
    );
}
