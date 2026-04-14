import React from 'react';
import './Home.css';

const Home = ({ setView }) => {
    return (
        <div className="home-hero">
            <div className="home-hero-bg">
                <img src="https://placehold.co/1600x800/4f46e5/ffffff?text=VIT+Campus" alt="College Campus" />
                <div className="home-hero-bg-overlay"></div>
            </div>
            <div className="home-hero-content">
                <h1>College Event Management System</h1>
                <p>Your one-stop portal for all events happening at VIT. Discover, apply, and manage events seamlessly.</p>
                <button onClick={() => setView('events')} className="btn home-hero-btn">
                    Browse Events
                </button>
            </div>
        </div>
    );
};

export default Home;