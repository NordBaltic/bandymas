import { useState } from "react";
import { useAuth } from "../loginsystem/AuthProvider";
import { useRouter } from "next/router";
import Loading from "../components/Loading";

export default function Register() {
    const { register } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRegister = async () => {
        setLoading(true);
        setError(null);
        try {
            await register(email, password);
            router.push("/dashboard");
        } catch (err) {
            setError("Registration failed. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="register-container">
            {loading && <Loading fullscreen />}
            <div className="register-card glass-morph fade-in">
                <h2>Create an Account</h2>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="error-text">{error}</p>}
                <button className="primary-btn" onClick={handleRegister}>Sign Up</button>
                <p className="redirect-text">Already have an account? <a href="/">Login</a></p>
            </div>
        </div>
    );
}
