import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { loginWithEmail, registerWithEmail } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        const { error } = await loginWithEmail(email, password);
        if (error) setError(error.message);
    };

    const handleRegister = async () => {
        const { error } = await registerWithEmail(email, password);
        if (error) setError(error.message);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Sign In</h1>
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
                <button onClick={handleLogin}>Login</button>
                <button onClick={handleRegister} className="register-btn">Register</button>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
                }
