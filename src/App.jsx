import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Import all components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import SignUp from './components/SignUP/SignUp';
import EventList from './components/EventList/EventList';
import EventDetails from './components/EventDetails/EventDetails';
import StudentDashboard from './components/StudentDashboard/StudentDashboard';
import OrganizerDashboard from './components/OrganizerDashboard/OrganizerDashboard';
import EventForm from './components/EventForm/EventForm';
import Modal from './components/Modal/Modal';

const API_URL = 'https://vit-events-api.onrender.com/api';

export default function App() {
    const [view, setView] = useState('home');
    const [currentUser, setCurrentUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventToEdit, setEventToEdit] = useState(null);
    const [modal, setModal] = useState({ isOpen: false, title: '', content: null });

    useEffect(() => {
        const fetchInitialData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const config = { headers: { 'Authorization': `Bearer ${token}` } };
                    const userResponse = await axios.get(`${API_URL}/users/me`, config);
                    setCurrentUser(userResponse.data);
                } catch (error) {
                    console.error("Session expired or token invalid:", error);
                    localStorage.removeItem('token');
                }
            }
            fetchEvents();
        };
        fetchInitialData();
    }, []);

    const fetchEvents = async () => {
        try {
            const eventsResponse = await axios.get(`${API_URL}/events`);
            setEvents(eventsResponse.data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const handleLogin = async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/users/login`, { username, password });
            localStorage.setItem('token', response.data.token);
            setCurrentUser(response.data.user);
            setView(response.data.user.role === 'organizer' ? 'organizerDashboard' : 'home');
        } catch (error) {
            setModal({ isOpen: true, title: 'Login Failed', content: <p>{error.response?.data?.message || 'Invalid username or password.'}</p> });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
        setView('login');
    };

    const handleSignUp = async (newUserData) => {
        try {
            await axios.post(`${API_URL}/users/signup`, newUserData);
            setModal({ isOpen: true, title: 'Success!', content: <p>Account created. Please log in.</p> });
            setView('login');
        } catch (error) {
            setModal({ isOpen: true, title: 'Sign Up Failed', content: <p>{error.response?.data?.message || 'An error occurred.'}</p> });
        }
    };

    const handleSelectEvent = (event) => { setSelectedEvent(event); setView('eventDetails'); };

    const handleApplyForEvent = async (eventId) => {
        if (!currentUser) {
            setModal({ isOpen: true, title: 'Login Required', content: <p>Please log in as a student to apply.</p> });
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.post(`${API_URL}/events/${eventId}/apply`, {}, config);
            setCurrentUser(response.data.updatedUser);
            setModal({ isOpen: true, title: 'Success', content: <p>You have successfully applied for the event!</p> });
        } catch (error) {
            setModal({ isOpen: true, title: 'Application Failed', content: <p>{error.response?.data?.message || 'Could not apply for the event.'}</p> });
        }
    };
    
    const handleEditEvent = (event) => { setEventToEdit(event); setView('eventForm'); };

    const handleSaveEvent = async (eventData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found. Please log in.');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            
            if (eventData._id) {
                await axios.put(`${API_URL}/events/${eventData._id}`, eventData, config);
            } else {
                await axios.post(`${API_URL}/events`, eventData, config);
            }
            
            fetchEvents();
            setView('organizerDashboard');
            setEventToEdit(null);
        } catch (error) {
            setModal({ isOpen: true, title: 'Save Failed', content: <p>{error.response?.data?.message || 'Could not save the event.'}</p> });
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found. Please log in.');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };

            await axios.delete(`${API_URL}/events/${eventId}`, config);
            
            fetchEvents();
            setModal({ isOpen: true, title: 'Success', content: <p>Event deleted successfully.</p> });
        } catch (error) {
            setModal({ isOpen: true, title: 'Delete Failed', content: <p>{error.response?.data?.message || 'Could not delete the event.'}</p> });
        }
    };

    const renderView = () => {
        switch (view) {
            case 'login': return <Login onLogin={handleLogin} setView={setView} />;
            case 'signup': return <SignUp onSignUp={handleSignUp} setView={setView} />;
            case 'events': return <EventList events={events} onSelectEvent={handleSelectEvent} onApply={handleApplyForEvent} currentUser={currentUser} />;
            case 'eventDetails': return <EventDetails event={selectedEvent} currentUser={currentUser} onApply={handleApplyForEvent} onBack={() => setView('events')} onEdit={handleEditEvent} />;
            case 'studentDashboard': return currentUser ? <StudentDashboard currentUser={currentUser} events={events} onSelectEvent={handleSelectEvent} /> : <Login onLogin={handleLogin} setView={setView} />;
            case 'organizerDashboard': return currentUser ? <OrganizerDashboard events={events} onSelectEvent={handleSelectEvent} setView={setView} onEdit={handleEditEvent} onDelete={handleDeleteEvent} /> : <Login onLogin={handleLogin} setView={setView} />;
            case 'eventForm': return currentUser?.role === 'organizer' ? <EventForm onSave={handleSaveEvent} onCancel={() => setView('organizerDashboard')} eventToEdit={eventToEdit} /> : <Login onLogin={handleLogin} setView={setView} />;
            case 'home': default: return <Home setView={setView} />;
        }
    };

   return (
        <div className="app-container">
            <Header currentUser={currentUser} onLogout={handleLogout} setView={setView} />
            <main>{renderView()}</main>
            <Footer />
            <Modal isOpen={modal.isOpen} onClose={() => setModal({ isOpen: false })} title={modal.title}>{modal.content}</Modal>
        </div>
    );
}