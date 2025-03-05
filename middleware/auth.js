const ensureAuthenticated = (req, res, next) => {
    if (req.session.userId) {
      return next();
    }
    
    req.session.error_msg = 'Please log in to access this page';
    res.redirect('/login');
  };
  
  module.exports = { ensureAuthenticated };
  