
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt'); // Ensure bcrypt is required for password comparison
const User = require('../models/user'); // Your User model

module.exports = function (passport) {
    // Local strategy for login
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'username', // Specify the field name for username
                passwordField: 'password', // Specify the field name for password
            },
            async (username, password, done) => {
                try {
                    console.log('Attempting to authenticate user:', username);

                    // Find user by username
                    const user = await User.findOne({ username });
                    if (!user) {
                        console.log('User not found in database');
                        return done(null, false, { message: 'Incorrect username' });
                    }

                    console.log('User found:', user);

                    // Compare provided password with hashed password in DB
                    console.log("Plain Password Entered:", password);
                    console.log("Stored Hashed Password:", user.password);
                    const isMatch = await bcrypt.compare(password, user.password);
                    console.log('Password matches:', isMatch);

                    if (!isMatch) {
                        console.log('Incorrect password provided');
                        return done(null, false, { message: 'Incorrect password' });
                    }

                    console.log('Authentication successful for user:', username);
                    return done(null, user); // Successfully authenticated
                } catch (error) {
                    console.error('Error during login process:', error);
                    return done(error);
                }
            }
        )
    );

    // Serialize the user into the session
    passport.serializeUser((user, done) => {
        console.log('Serializing user:', user.id);
        done(null, user.id); // Store the user ID in the session
    });

    // Deserialize the user from the session
    passport.deserializeUser(async (id, done) => {
        try {
            console.log('Deserializing user ID:', id);
            const user = await User.findById(id); // Fetch the user by ID
            done(null, user);
        } catch (error) {
            console.error('Error during deserialization:', error);
            done(error, null);
        }
    });
};
