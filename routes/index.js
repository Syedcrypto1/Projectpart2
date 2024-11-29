const express = require('express');
const router = express.Router();
const survey = require('../models/survey'); // Import the survey model for consistency

// Route for the home page
router.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

// Route for the support page (/support)
router.get('/support', (req, res) => {
  res.render('support', { title: 'Support' });
});

// Route for rendering the surveys add page
router.get('/surveys/add', (req, res) => {
  res.render('addsurvey', { title: 'Add New survey' });
});

// Route for checking inventory (/surveys/check)
router.get('/surveys/check', async (req, res) => {
  try {
    const surveys = await survey.find(); // Fetch all surveys from the database
    res.render('checkInventory', { title: 'Check Inventory', surveys });
  } catch (error) {
    res.render('error', { title: 'Error', message: error.message, error });
  }
});

module.exports = router;
