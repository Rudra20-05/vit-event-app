const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware'); // 1. Import the protect middleware

// --- SIGNUP ROUTE ---
router.post('/signup', async (req, res) => {
    // ... (This route's code remains unchanged)
    const { name, rollNo, username, password } = req.body;

    try {
        let user = await User.findOne({ $or: [{ username }, { rollNo }] });
        if (user) {
            return res.status(400).json({ message: 'User with this username or roll number already exists.' });
        }

        user = new User({ name, rollNo, username, password });
        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(201).json({ message: 'User created successfully', user: userResponse });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    // ... (This route's code remains unchanged)
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
 
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                const userResponse = user.toObject();
                delete userResponse.password;
                res.status(200).json({
                    message: 'Login successful',
                    token,
                    user: userResponse
                });
            }
        );

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// --- GET LOGGED IN USER DATA (New Route) ---
// @route   GET /api/users/me
// @desc    Get user data from token
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        // The 'protect' middleware has already verified the token and added the user to the request (req.user)
        const user = await User.findById(req.user.id).select('-password'); // Find user by ID and exclude the password
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;