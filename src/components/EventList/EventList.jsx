import React, { useState } from 'react';
import EventCard from '../EventCard/EventCard';
import './EventList.css';

const EventList = ({ events, onSelectEvent, onApply, currentUser }) => {
    const [filter, setFilter] = useState('All');
    const categories = ['All', ...new Set(events.map(e => e.category))];
    const filteredEvents = events.filter(e => e.active && (filter === 'All' || e.category === filter));

    return (
        <div className="container">
            <h2 className="event-list-header">Upcoming Events</h2>
            <div className="event-filters">
                {categories.map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setFilter(cat)} 
                        className={filter === cat ? 'active' : ''}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="event-grid">
                {filteredEvents.map(event => (
                    <EventCard 
                        key={event.id} 
                        event={event} 
                        onSelectEvent={onSelectEvent} 
                        onApply={onApply} 
                        currentUser={currentUser} 
                    />
                ))}
            </div>
        </div>
    );
};

export default EventList;