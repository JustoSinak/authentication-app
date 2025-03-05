const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const User = require('../models/User');

// Dashboard route
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    res.render('dashboard', { user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;