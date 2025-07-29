const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

// JWT Strategy for API authentication
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id).select('-password');
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        console.error('JWT Strategy Error:', error);
        return done(error, false);
      }
    }
  )
);

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google OAuth Strategy - Profile:', {
      id: profile.id,
      displayName: profile.displayName,
      email: profile.emails?.[0]?.value,
      photos: profile.photos?.length
    });

    // First, check if user exists by Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      console.log('User found by Google ID:', user.email);
      // User exists with Google ID, log them in
      user.lastActive = new Date();
      user.isOnline = true;
      await user.save();
      return done(null, user);
    }
    
    // Check if user exists by email (they might have signed up with email/password first)
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      console.log('User found by email, linking Google account:', user.email);
      // User exists with email, link Google account to existing account
      user.googleId = profile.id;
      if (!user.avatar && profile.photos && profile.photos.length > 0) {
        user.avatar = profile.photos[0].value;
      }
      user.lastActive = new Date();
      user.isOnline = true;
      await user.save();
      return done(null, user);
    }
    
    // Create new user
    console.log('Creating new user with Google OAuth');
    user = new User({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
      isEmailVerified: true, // Google emails are verified
      isOnline: true,
      lastActive: new Date()
    });
    
    await user.save();
    console.log('New user created:', user.email);
    done(null, user);
  } catch (error) {
    console.error('Google OAuth Strategy Error:', error);
    done(error, null);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  console.log('Serializing user:', user._id);
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    console.log('Deserializing user:', id);
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    console.error('Deserialize user error:', error);
    done(error, null);
  }
});

module.exports = passport;