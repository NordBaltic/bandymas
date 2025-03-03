import { useState } from "react";
import { useAuth } from "../loginsystem/useAuth";

export default function Register() {
    const { register } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async () => {
        const result = await register(email, password);
        if (result.success) {
            window.location.href = "/dashboard";
        } else {
            setMessage(result.error);
        }
    };

    return (
        <div className="auth-container">
            <h2>Sign Up</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="primary-btn" onClick={handleRegister}>
                Register
            </button>
            {message && <p className="error-text">{message}</p>}
            <p className="switch-text">
                Already have an account? <a href="/login">Login</a>
            </p>
        </div>
    );
}
