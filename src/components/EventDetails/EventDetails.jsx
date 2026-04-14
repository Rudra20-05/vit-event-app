import React from 'react';
import Icon from '../Icon/Icon';
import './EventDetails.css';

const EventDetails = ({ event, currentUser, onApply, onBack, onEdit }) => {
    if (!event) return <div className="container"><p>Event not found.</p></div>;

    const hasApplied = currentUser?.role === 'student' && currentUser.appliedEvents.includes(event._id);
    const isOrganizer = currentUser?.role === 'organizer';

    return (
        <div className="container">
            <button onClick={onBack} className="back-button">
                <Icon path="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                <span>Back to Events</span>
            </button>
            <div className="details-card">
                <div className="details-header">
                    <div>
                        <p className="details-category">{event.category}</p>
                        <h1 className="details-title">{event.name}</h1>
                    </div>
                    {isOrganizer && (
                        <button onClick={() => onEdit(event)} className="btn btn-edit">
                            Edit Event
                        </button>
                    )}
                </div>
                <div className="details-meta-grid">
                    <div className="meta-item"><Icon path="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" /><div className="meta-text"><p>Date & Time</p><p>{new Date(event.date).toDateString()} at {event.time}</p></div></div>
                    <div className="meta-item"><Icon path="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /><div className="meta-text"><p>Location</p><p>{event.location}</p></div></div>
                    <div className="meta-item"><Icon path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /><div className="meta-text"><p>Eligibility</p><p>{event.eligibility}</p></div></div>
                </div>
                <div className="details-section">
                    <h2>About the Event</h2>
                    <p>{event.description}</p>
                </div>
                <div className="details-section">
                    <h2>Application Details</h2>
                    <p>Application Period: {new Date(event.applicationStartDate).toLocaleDateString()} - {new Date(event.applicationEndDate).toLocaleDateString()}</p>
                    <p>Capacity: {event.capacity} attendees</p>
                </div>
                {currentUser?.role === 'student' && (
                    <div className="details-apply-container">
                        <button onClick={() => onApply(event._id)} disabled={hasApplied} className="btn btn-primary apply-btn">
                            {hasApplied ? 'Applied Successfully' : 'Apply Now'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDetails;