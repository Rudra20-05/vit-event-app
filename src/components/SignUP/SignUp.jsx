import React, { useState } from 'react';
import '../Login/Login.css'; // Re-using the login styles

const SignUp = ({ onSignUp, setView }) => {
    const [name, setName] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = (e) => {
        e.preventDefault();
        onSignUp({ name, rollNo, username, password });
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Create your student account</h2>
                <form className="auth-form" onSubmit={handleSignUp}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="form-input" placeholder="Full Name" />
                    </div>
                    <div className="form-group">
                        <label>Roll Number</label>
                        <input type="text" required value={rollNo} onChange={(e) => setRollNo(e.target.value)} className="form-input" placeholder="e.g., 23101C0001" />
                    </div>
                     <div className="form-group">
                        <label>Username</label>
                        <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="form-input" placeholder="Choose a username" />
                    </div>
                     <div className="form-group">
                        <label>Password</label>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" placeholder="Password" />
                    </div>
                    <button type="submit" className="btn btn-primary auth-btn">Sign Up</button>
                </form>
                <p className="auth-switch-text">
                    Already have an account?{' '}
                    <button onClick={() => setView('login')} className="auth-switch-btn">
                        Log In
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignUp;