import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin, setView }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        onLogin(username, password);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Sign in to your account</h2>
                <form className="auth-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-input"
                            placeholder="Username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            placeholder="Password"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary auth-btn">
                        Sign in
                    </button>
                </form>
                <p className="auth-switch-text">
                    Don't have an account?{' '}
                    <button onClick={() => setView('signup')} className="auth-switch-btn">
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;