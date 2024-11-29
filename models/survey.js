// models/survey.js
const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentID: { type: String },
  birthday: { type: Date },
  status: { 
    type: String, 
    enum: ['Teacher', 'Student', 'Other'], 
    required: true 
  },
  notes: { type: String }},
  {
    collection:"survey"
  },);

module.exports = mongoose.model('survey', surveySchema);
