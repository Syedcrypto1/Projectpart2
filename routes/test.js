// routes/test.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('test'); // Render the `test.ejs` view
});

module.exports = router;
