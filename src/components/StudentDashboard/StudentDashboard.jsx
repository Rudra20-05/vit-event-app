import React from 'react';
import './StudentDashboard.css';

const StudentDashboard = ({ currentUser, events, onSelectEvent }) => {
    const appliedEvents = events.filter(event => currentUser.appliedEvents.includes(event._id));

    return (
        <div className="container">
            <div className="dashboard-header">
                <h1>My Dashboard</h1>
            </div>
            <div className="dashboard-card">
                <h2>My Applied Events</h2>
                {appliedEvents.length > 0 ? (
                    <div className="applied-events-list">
                        {appliedEvents.map(event => (
                            <div key={event._id} className="applied-event-item">
                                <div>
                                    <h3>{event.name}</h3>
                                    <p>{new Date(event.date).toLocaleDateString()} - {event.location}</p>
                                </div>
                                <button onClick={() => onSelectEvent(event)} className="btn btn-secondary">
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You haven't applied for any events yet.</p>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;