const express = require('express');
const passport = require('passport');
const User = require('../models/user'); // Assuming you have a User model
const router = express.Router();

// --- REGISTER ROUTES ---

// Render the registration form
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

// Handle user registration
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).render('register', {
            title: 'Register',
            error: 'All fields are required.',
        });
    }

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).render('register', {
                title: 'Register',
                error: 'Username already exists.',
            });
        }

        // Create and save a new user (let the pre-save middleware handle password hashing)
        const newUser = new User({ username, password });
        await newUser.save();

        console.log("User registered successfully:", username);

        // Redirect to the login page
        res.redirect('/auth/login');
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).render('register', {
            title: 'Register',
            error: 'An error occurred while creating your account. Please try again.',
        });
    }
});

// --- LOGIN ROUTES ---

// Render the login form
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

// Handle user login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error("Authentication Error:", err);
            return res.status(500).render('login', {
                title: 'Login',
                error: 'An error occurred during login. Please try again.',
            });
        }
        if (!user) {
            console.log("Authentication failed:", info ? info.message : 'Invalid credentials');
            return res.status(401).render('login', {
                title: 'Login',
                error: 'Invalid username or password.',
            });
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error("Session Setup Error:", err);
                return res.status(500).render('login', {
                    title: 'Login',
                    error: 'An error occurred while logging in. Please try again.',
                });
            }
            console.log("User authenticated successfully:", user);
            res.redirect('/dashboard'); // Redirect to the dashboard after successful login
        });
    })(req, res, next);
});

// --- LOGOUT ROUTE ---

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                console.error("Session Destruction Error:", err);
                return res.status(500).send('An error occurred while logging out.');
            }
            res.clearCookie('connect.sid'); // Clear the session cookie
            res.redirect('/auth/login'); // Redirect to the login page
        });
    });
});

module.exports = router;
