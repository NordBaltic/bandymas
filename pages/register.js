import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../loginsystem/useAuth";
import Loading from "../components/Loading";

export default function Register() {
    const { register } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const result = await register(email, password);
        if (result.success) {
            router.push("/dashboard");
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="register-container">
            {loading && <Loading fullscreen />}
            <div className="register-card glass-morph fade-in">
                <h2>Create an Account</h2>
                <form onSubmit={handleRegister}>
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Create a password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="error-text">{error}</p>}
                    <button type="submit" className="primary-btn">Sign Up</button>
                </form>
                <p>Already have an account? <a href="/login">Login</a></p>
            </div>
        </div>
    );
}
