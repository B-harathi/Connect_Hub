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
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: '/auth/google/callback',
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Check if user already exists
//         let user = await User.findOne({ googleId: profile.id });
        
//         if (user) {
//           // User exists, update last login
//           user.lastActive = new Date();
//           await user.save();
//           return done(null, user);
//         }

//         // Check if user exists with same email
//         user = await User.findOne({ email: profile.emails[0].value });
        
//         if (user) {
//           // Link Google account to existing user
//           user.googleId = profile.id;
//           user.avatar = profile.photos[0]?.value || user.avatar;
//           user.lastActive = new Date();
//           await user.save();
//           return done(null, user);
//         }

//         // Create new user
//         user = new User({
//           googleId: profile.id,
//           email: profile.emails[0].value,
//           name: profile.displayName,
//           avatar: profile.photos[0]?.value,
//           isEmailVerified: true, // Google emails are verified
//           lastActive: new Date(),
//         });

//         await user.save();
//         return done(null, user);
        
//       } catch (error) {
//         console.error('Google Strategy Error:', error);
//         return done(error, null);
//       }
//     }
//   )
// );
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // First, check if user exists by Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      // User exists with Google ID, log them in
      return done(null, user);
    }
    
    // Check if user exists by email (they might have signed up with email/password first)
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // User exists with email, link Google account to existing account
      user.googleId = profile.id;
      if (!user.avatar && profile.photos && profile.photos.length > 0) {
        user.avatar = profile.photos[0].value;
      }
      await user.save();
      return done(null, user);
    }
    
    // Create new user
    user = new User({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
      isOnline: true,
      lastActive: new Date()
    });
    
    await user.save();
    done(null, user);
  } catch (error) {
    console.error('Google OAuth error:', error);
    done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;