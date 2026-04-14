import React from 'react';
import Card from '../card/card';
import Icon from '../Icon/Icon';
import './EventCard.css';

const EventCard = ({ event, onSelectEvent, onApply, currentUser }) => {
    const hasApplied = currentUser?.role === 'student' && currentUser.appliedEvents.includes(event._id);

    return (
        <Card>
            <div className="event-card-content">
                <div className="event-card-header">
                    <p className="event-card-category">{event.category}</p>
                    <span className="event-card-status">Open</span>
                </div>
                <h3 className="event-card-title">{event.name}</h3>
                <p className="event-card-desc">{event.description}</p>
                
                <div className="event-card-footer">
                    <div className="event-card-info">
                        <div className="info-item">
                            <Icon path="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" />
                            <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at {event.time}</span>
                        </div>
                        <div className="info-item">
                            <Icon path="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            <span>{event.location}</span>
                        </div>
                    </div>
                    <div className="event-card-buttons">
                        <button onClick={() => onSelectEvent(event)} className="btn btn-secondary">
                            Details
                        </button>
                        {currentUser?.role === 'student' && (
                            <button onClick={() => onApply(event._id)} disabled={hasApplied} className="btn btn-primary">
                                {hasApplied ? 'Applied' : 'Apply'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default EventCard;