import React from 'react';
import Icon from '../Icon/Icon';
import './OrganizerDashboard.css';

const OrganizerDashboard = ({ events, onSelectEvent, setView, onEdit, onDelete }) => {
    return (
        <div className="container">
            <div className="dashboard-header org-header">
                <h1>Admin Dashboard</h1>
                <button onClick={() => setView('eventForm')} className="btn btn-create">
                    <Icon path="M12 4.5v15m7.5-7.5h-15" />
                    Create New Event
                </button>
            </div>
            <div className="dashboard-card">
                <h2>Managed Events</h2>
                <div className="managed-events-list">
                    {events.map(event => (
                        <div key={event._id} className="managed-event-item">
                            <div className="managed-event-header">
                                <div>
                                    <h3>{event.name}</h3>
                                    <p className={`status ${event.active ? 'active' : 'inactive'}`}>
                                        Status: {event.active ? 'Active' : 'Inactive'}
                                    </p>
                                </div>
                                <div className="managed-event-buttons">
                                    <button onClick={() => onDelete(event._id)} className="btn btn-delete">Delete</button>
                                    <button onClick={() => onEdit(event)} className="btn btn-edit">Edit</button>
                                    <button onClick={() => onSelectEvent(event)} className="btn btn-secondary">View</button>
                                </div>
                            </div>
                            <div className="applicants-section">
                                <h4>Applicants ({event.applications.length} / {event.capacity})</h4>
                                {event.applications.length > 0 ? (
                                    <ul>
                                        {event.applications.map(applicant => (
                                            <li key={applicant._id}>{applicant.name} (Roll No: {applicant.rollNo})</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="no-applicants">No applicants yet.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrganizerDashboard;