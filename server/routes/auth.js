// const express = require('express');
// const passport = require('passport');
// const router = express.Router();

// // Import controllers and middleware
// const {
//   register,
//   login,
//   getProfile,
//   updateProfile,
//   changePassword,
//   logout,
//   googleCallback,
//   verifyToken,
//   deleteAccount,
//   updateNotificationSettings
// } = require('../controllers/authController');

// const { authenticate } = require('../middleware/auth');
// const authController = require('../controllers/authController');
// const { authLimiter, registerLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');
// const {
//   validateUserRegistration,
//   validateUserLogin,
//   validateProfileUpdate,
//   validatePasswordChange
// } = require('../middleware/validation');

// // Public routes
// router.post('/register', registerLimiter, validateUserRegistration, register);
// router.post('/login', authLimiter, validateUserLogin, login);

// // Google OAuth routes
// // router.get('/google',
// //   passport.authenticate('google', { scope: ['profile', 'email'] })
// // );

// // router.get('/google/callback',
// //   passport.authenticate('google', { session: false }),
// //   googleCallback
// // );

// router.get('/google',
//   passport.authenticate('google', { scope: ['profile', 'email'], session: false })
// );

// router.get('/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   authController.googleCallback
// );

// // Protected routes
// router.use(authenticate); // All routes below require authentication

// // Profile routes
// router.get('/profile', getProfile);
// router.put('/profile', validateProfileUpdate, updateProfile);
// router.put('/password', validatePasswordChange, changePassword);
// router.delete('/account', deleteAccount);

// // Token verification
// router.get('/verify', verifyToken);

// // Logout
// router.post('/logout', logout);

// // Notification settings
// router.put('/notifications', updateNotificationSettings);

// module.exports = router;


const express = require('express');
const passport = require('passport');
const router = express.Router();

// Import controllers and middleware
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  googleCallback,
  verifyToken,
  deleteAccount,
  updateNotificationSettings
} = require('../controllers/authController');

const { authenticate } = require('../middleware/auth');
const { authLimiter, registerLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');
const {
  validateUserRegistration,
  validateUserLogin,
  validateProfileUpdate,
  validatePasswordChange
} = require('../middleware/validation');

// Public routes
router.post('/register', registerLimiter, validateUserRegistration, register);
router.post('/login', authLimiter, validateUserLogin, login);

// Google OAuth routes - CORRECTED
router.get('/google', (req, res, next) => {
  console.log('Initiating Google OAuth flow');
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    accessType: 'offline',
    prompt: 'consent'
  })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  console.log('Google OAuth callback route hit');
  console.log('Query params:', req.query);
  console.log('Session before auth:', req.session);
  
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=authentication_failed`,
    session: true // Enable session for OAuth
  })(req, res, next);
}, googleCallback);

// Debug route to test Google OAuth configuration
router.get('/test-google-config', (req, res) => {
  res.json({
    success: true,
    config: {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasSessionSecret: !!process.env.SESSION_SECRET,
      clientIdLength: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.length : 0,
      callbackUrl: '/api/auth/google/callback',
      clientUrl: process.env.CLIENT_URL || 'http://localhost:3000'
    }
  });
});

// Token verification (can be called without authentication)
router.get('/verify', authenticate, verifyToken);

// Protected routes middleware
router.use('/profile', authenticate);
router.use('/password', authenticate);
router.use('/account', authenticate);
router.use('/logout', authenticate);
router.use('/notifications', authenticate);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', validateProfileUpdate, updateProfile);

// Password management
router.put('/password', validatePasswordChange, changePassword);

// Account management
router.delete('/account', deleteAccount);

// Logout
router.post('/logout', logout);

// Notification settings
router.put('/notifications', updateNotificationSettings);

module.exports = router;