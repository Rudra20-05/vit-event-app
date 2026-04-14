const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const { protect, isOrganizer } = require('../middleware/authMiddleware');

// --- GET ALL EVENTS (Public Route) ---
router.get('/', async (req, res) => {
    try {
        // This now populates both the organizer's name and the applicants' details
        const events = await Event.find()
            .populate('organizerId', 'name')
            .populate('applications', 'name rollNo'); // <-- This is the key update
        res.json(events);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// --- APPLY FOR AN EVENT (Protected Route for Students) ---
router.post('/:id/apply', protect, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        const user = await User.findById(req.user.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.applications.includes(user.id) || user.appliedEvents.includes(event.id)) {
            return res.status(400).json({ message: 'You have already applied for this event.' });
        }

        event.applications.push(user.id);
        user.appliedEvents.push(event.id);

        await event.save();
        const updatedUser = await user.save();

        const userResponse = updatedUser.toObject();
        delete userResponse.password;
        res.json({ message: 'Successfully applied for event', updatedUser: userResponse });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


// --- CREATE AN EVENT (Protected Organizer Route) ---
router.post('/', protect, isOrganizer, async (req, res) => {
    try {
        const newEvent = new Event({
            ...req.body,
            organizerId: req.user.id
        });
        const event = await newEvent.save();
        res.status(201).json(event);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// --- UPDATE AN EVENT (Protected Organizer Route) ---
router.put('/:id', protect, isOrganizer, async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// --- DELETE AN EVENT (Protected Organizer Route) ---
router.delete('/:id', protect, isOrganizer, async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
