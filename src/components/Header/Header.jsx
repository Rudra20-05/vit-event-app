import React from 'react';
import './Header.css';
import Icon from '../Icon/Icon';

// 1. Receive 'onLogout' as a prop and remove 'setCurrentUser'
const Header = ({ currentUser, onLogout, setView }) => {
    
    // 2. The local handleLogout function is no longer needed here.

    return (
        <header className="header">
            <nav className="header-nav">
                <div className="header-logo" onClick={() => setView('home')}>
                    <Icon path="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                    <span>VIT Events</span>
                </div>
                <div className="header-links">
                    <a href="#" onClick={(e) => { e.preventDefault(); setView('home'); }}>Home</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); setView('events'); }}>Events</a>
                    {currentUser?.role === 'student' && <a href="#" onClick={(e) => { e.preventDefault(); setView('studentDashboard'); }}>My Dashboard</a>}
                    {currentUser?.role === 'organizer' && <a href="#" onClick={(e) => { e.preventDefault(); setView('organizerDashboard'); }}>Organizer Dashboard</a>}
                </div>
                <div className="header-user-info">
                    {currentUser ? (
                        <>
                            <span>Welcome, {currentUser.name}</span>
                            {/* 3. The button now calls the onLogout prop from App.jsx */}
                            <button onClick={onLogout} className="btn btn-primary">Logout</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setView('login')} className="btn btn-secondary">Login</button>
                            <button onClick={() => setView('signup')} className="btn btn-primary">Sign Up</button>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;