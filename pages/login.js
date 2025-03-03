import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../loginsystem/useAuth";
import Loading from "../components/Loading";

export default function Login() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const result = await login(email, password);
        if (result.success) {
            router.push("/dashboard");
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="login-container">
            {loading && <Loading fullscreen />}
            <div className="login-card glass-morph fade-in">
                <h2>Login to Your Account</h2>
                <form onSubmit={handleLogin}>
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Enter your password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="error-text">{error}</p>}
                    <button type="submit" className="primary-btn">Login</button>
                </form>
                <p>Don't have an account? <a href="/register">Sign Up</a></p>
            </div>
        </div>
    );
}
