import React, { useState } from 'react';
import './EventForm.css';

const EventForm = ({ onSave, onCancel, eventToEdit }) => {
    const [eventData, setEventData] = useState(
        eventToEdit || {
            name: '', description: '', date: '', time: '', location: '', 
            eligibility: '', category: 'Academic', capacity: 100, 
            applicationStartDate: '', applicationEndDate: ''
        }
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(eventData);
    };

    return (
        <div className="container">
            <h1 className="form-title">{eventToEdit ? 'Edit Event' : 'Create New Event'}</h1>
            <form onSubmit={handleSubmit} className="event-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Event Name</label>
                        <input type="text" name="name" value={eventData.name} onChange={handleChange} required className="form-input" />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={eventData.category} onChange={handleChange} className="form-input">
                            <option>Academic</option>
                            <option>Cultural</option>
                            <option>Sports</option>
                            <option>Networking</option>
                            <option>Workshop</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={eventData.description} onChange={handleChange} rows="4" required className="form-input"></textarea>
                </div>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Date</label>
                        <input type="date" name="date" value={eventData.date} onChange={handleChange} required className="form-input" />
                    </div>
                    <div className="form-group">
                        <label>Time</label>
                        <input type="time" name="time" value={eventData.time} onChange={handleChange} required className="form-input" />
                    </div>
                </div>
                <div className="form-group">
                    <label>Location</label>
                    <input type="text" name="location" value={eventData.location} onChange={handleChange} required className="form-input" />
                </div>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Eligibility Criteria</label>
                        <input type="text" name="eligibility" value={eventData.eligibility} onChange={handleChange} required className="form-input" />
                    </div>
                    <div className="form-group">
                        <label>Capacity</label>
                        <input type="number" name="capacity" value={eventData.capacity} onChange={handleChange} required className="form-input" />
                    </div>
                </div>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Application Start Date</label>
                        <input type="date" name="applicationStartDate" value={eventData.applicationStartDate} onChange={handleChange} required className="form-input" />
                    </div>
                    <div className="form-group">
                        <label>Application End Date</label>
                        <input type="date" name="applicationEndDate" value={eventData.applicationEndDate} onChange={handleChange} required className="form-input" />
                    </div>
                </div>
                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="btn btn-cancel">Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Event</button>
                </div>
            </form>
        </div>
    );
};

export default EventForm;