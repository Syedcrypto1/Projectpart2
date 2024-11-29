const express = require('express');
const router = express.Router();
const survey = require('../models/survey'); // Import the survey model

// Route to render the form for adding a new survey
router.get('/add', (req, res) => {
  res.render('addsurvey', { title: 'Add New survey' });
});

// Route to handle form submission for adding a new survey
router.post('/add', async (req, res) => {
  try {
    const { name, studentID, birthday, status, notes } = req.body;

    // Validate required fields
    if (!name || !status) {
      throw new Error('Name and Status are required.');
    }

    const newsurvey = new survey({
      name,
      studentID,
      birthday,
      status,
      notes
    });

    await newsurvey.save();
    res.redirect('/surveys/check'); // Redirect to check inventory
  } catch (error) {
    res.render('error', { title: 'Error', message: error.message, error });
  }
});


// Route to render the form for looking up a survey
router.get('/lookup', (req, res) => {
  res.render('lookupsurvey', { title: 'Lookup survey', message: null });
});

// Route to handle lookup functionality
router.post('/lookup', async (req, res) => {
  try {
    const { studentID } = req.body;

    // Search for the survey 
    const surveyItem = await survey.findOne({ studentID });

    if (!surveyItem) {
      res.render('lookupsurvey', { title: 'Lookup survey', message: 'No result found for this serial number', survey: null });
    } else {
      res.render('surveyDetails', { title: 'survey Details', survey: surveyItem });
    }
  } catch (error) {
    res.render('error', { title: 'Error', message: error.message, error });
  }
});

// Route to render the edit form for a survey
router.get('/edit/:id', async (req, res) => {
  try {
    const surveyItem = await survey.findById(req.params.id);
    if (!surveyItem) {
      throw new Error('Survey not found');
    }
    res.render('editsurvey', { title: 'Edit survey', survey: surveyItem });
  } catch (error) {
    res.render('error', { title: 'Error', message: error.message, error });
  }
});

// Route to handle editing a survey
router.post('/edit/:id', async (req, res) => {
  try {
    const { name, studentID, birthday, status, notes } = req.body;

    await survey.findByIdAndUpdate(req.params.id, {
      name,
      studentID,
      birthday,
      status,
      notes
    });

    res.redirect('/surveys/check'); // Redirect to survey list
  } catch (error) {
    res.render('error', { title: 'Error', message: error.message, error });
  }
});

// Route for checking inventory (/survey/check)
router.get('/check', async (req, res) => {
  try {
    const surveyItems = await survey.find(); // Fetch all surveys from the database
    res.render('checkInventory', { title: 'Check Inventory', survey: surveyItems });
  } catch (error) {
    res.render('error', { title: 'Error', message: error.message, error });
  }
});

module.exports = router;


