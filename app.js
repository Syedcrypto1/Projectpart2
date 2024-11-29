const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
require('dotenv').config();
const initializePassport = require('./config/passport'); // Passport config

const app = express();

// Middleware to set user in local variables for templates
app.use((req, res, next) => {
  res.locals.user = req.user || null; // Set user to req.user if available, otherwise null
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret', // Fallback to default secret
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || 'mongodb+srv://syedakbarzada1:rRnWy9KtRDCH1bvt@cluster0.w9o24.mongodb.net/Project1', // Fallback for mongoUrl
    }),
    cookie: { secure: process.env.NODE_ENV === 'production' }, // Secure cookies in production
  })
);

// Initialize Passport
initializePassport(passport); // Load Passport strategies
app.use(passport.initialize());
app.use(passport.session());

// Routes
const indexRouter = require('./routes/index');
const surveysRouter = require('./routes/survey');
const authRouter = require('./routes/auth'); // Authentication routes

app.use('/', indexRouter);
app.use('/surveys', surveysRouter);
app.use('/auth', authRouter);

// Protected Route: Dashboard
app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth/login');
  }
  res.render('dashboard', { 
    user: req.user, 
    title: 'Dashboard' // Set the page title for the dashboard
  });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).render('error', {
    title: 'Error',
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {}, // Show detailed errors in development
  });
});

// 404 Page Not Found
app.use((req, res, next) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
    error: {},
  });
});

module.exports = app;
