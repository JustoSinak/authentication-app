const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Render register page
router.get('/register', (req, res) => {
  res.render('register');
});

// Register user
router.post('/register', async (req, res) => {
  const { name, email, password, password2 } = req.body;
  
  // Validation
  let errors = [];
  
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }
  
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }
  
  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }
  
  if (errors.length > 0) {
    return res.render('register', {
      errors,
      name,
      email
    });
  }
  
  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      errors.push({ msg: 'Email is already registered' });
      return res.render('register', {
        errors,
        name,
        email
      });
    }
    
    // Create new user
    const newUser = new User({
      name,
      email,
      password
    });
    
    await newUser.save();
    
    req.session.success_msg = 'You are now registered and can log in';
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Render login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Render home page
router.get('/', (req, res) => {
  res.render('login');
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.render('login', {
        errors: [{ msg: 'Invalid email or password' }],
        email
      });
    }
    
    // Check password
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.render('login', {
        errors: [{ msg: 'Invalid email or password' }],
        email
      });
    }
    
    // Save user ID to session
    req.session.userId = user.id;
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Logout user
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.redirect('/login');
  });
});

module.exports = router;